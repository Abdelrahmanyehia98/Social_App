import { NextFunction, Request, Response } from "express"
import { IUser, OtpTypesEnum ,IRequest, SignUpBodyType} from "../../../Common"
import { UserRepository,BlackListedRepository } from "../../../DB/Repositories"
import { BlacklistedTokensModel } from "../../../DB/Models"
import { encrypt, generateHash, localEmitter,compareHash,generateToken, SuccessResponse } from "../../../Utils"
import { randomUUID } from 'crypto';
import { SignOptions } from "jsonwebtoken"

class AuthServices {

    private userRepo : UserRepository = new UserRepository()
    private blackListedRepo: BlackListedRepository = new BlackListedRepository(BlacklistedTokensModel)
    
    signUp = async(req:Request, res:Response, next:NextFunction) =>{
        const { firstName, lastName, email, password, gender, phoneNumber , DOB}: SignUpBodyType = req.body
        
        const isEmailExists = await this.userRepo.findOneDocument({email},'email');
        if(isEmailExists) return res.status(400).json({message:'email already exists'})

        const encryptedPhoneNumber = encrypt(phoneNumber as string)

        const hashedPassword = generateHash(password as string)

        // Send OTP
        const otp = Math.floor(Math.random() * 1000000).toString()
        localEmitter.emit('sendEmail',
            {
                to: email,
                subject: 'Otp for Sign up',
                content: `Your OTP is ${otp}`
            })

        const confirmationOtp = {
            value: generateHash(otp),
            expiresAt: Date.now() + 600000,
            otpType: OtpTypesEnum.CONFIRMATION
        }

        const newUser = await this.userRepo.createNewDocument({
            firstName, lastName, email, password : hashedPassword,
            gender, DOB, 
            phoneNumber : encryptedPhoneNumber,
            OTPS: [confirmationOtp]
        })
        return res.status(201).json(SuccessResponse<IUser>('User created successfully', 201, newUser as unknown as IUser))

    }

    SignIn = async (req: Request, res: Response) => {

        const { email, password } = req.body;

        const user: IUser | null = await this.userRepo.findOneDocument({ email });
        if (!user) return res.status(401).json({ message: 'Email/password is incorrect' });

        const isPasswordMatched = compareHash(password, user.password);
        if (!isPasswordMatched) return res.status(401).json({ message: 'Email/password is incorrect' });

        const accessToken = generateToken(
            {
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
                jwtid: randomUUID(),
            }
        );

        const refreshToken = generateToken(
            {
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            },
            process.env.JWT_REFRESH_SECRET as string,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
                jwtid: randomUUID(),
            }
        );

        return res.status(200).json({ message: 'User logged in successfully', data: { tokens: { accessToken, refreshToken } } })
    }

    ConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp }: { email: string; otp: string } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await this.userRepo.findOneDocument({
            email,
            isVerified: false, 
        });

        if (!user)
            return res.status(409).json({
                message: "invalid Email",
                data: { invalidEmail: email },
            });

        const confirmationOtp = user.OTPS?.find(
            (otpItem) => otpItem.otpType === OtpTypesEnum.CONFIRMATION
        );
        if (!confirmationOtp) {
            return res.status(400).json({ message: "No confirmation OTP found" });
        }

        const isOtpMatched = compareHash(otp, confirmationOtp.value);
        if (!isOtpMatched) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isVerified = true;

        user.OTPS = user.OTPS?.filter(
            (otpItem) => otpItem.otpType !== OtpTypesEnum.CONFIRMATION
        );

        await (user as any).save();

        return res.status(200).json({ 
            message: "Email verified successfully",
            data: {
                email: user.email,
                isVerified: user.isVerified
            }
        });
    };


    
    logOut = async (req: Request, res: Response) => {
        const { token: { jti, exp } } = (req as unknown as IRequest).loggedInUser
        const blackListedToken = await this.blackListedRepo.createNewDocument({
            tokenId: jti, expiresAt: new Date(exp || Date.now() + 600000)
        })
        return res.status(200).json({ message: 'User logged out successfully', data: { blackListedToken } })
    }


    forgetPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await this.userRepo.findOneDocument({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(Math.random() * 1000000).toString();

        localEmitter.emit('sendEmail', {
            to: email,
            subject: 'Reset Password OTP',
            content: `Your OTP is ${otp}`
        });

        user.OTPS?.push({
            value: generateHash(otp),
            expiresAt: Date.now() + 10 * 60 * 1000,
            otpType: OtpTypesEnum.RESET_PASSWORD
        });

        await (user as any).save();

        return res.status(200).json({ message: 'OTP sent to email' });
    };



    resetPassword = async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await this.userRepo.findOneDocument({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetOtp = user.OTPS?.find(
            (o) => o.otpType === OtpTypesEnum.RESET_PASSWORD
        );

        if (!resetOtp) {
            return res.status(400).json({ message: 'No reset OTP found' });
        }

        if (resetOtp.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const isOtpMatched = compareHash(otp, resetOtp.value);
        if (!isOtpMatched) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.password = generateHash(newPassword);
        user.OTPS = user.OTPS?.filter(
            (o) => o.otpType !== OtpTypesEnum.RESET_PASSWORD
        );

        await (user as any).save();

        return res.status(200).json({ message: 'Password reset successfully' });
    };



    updatePassword = async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body;
        const { user: { _id } } = (req as IRequest).loggedInUser;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await this.userRepo.findDocumentById(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordMatched = compareHash(oldPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        user.password = generateHash(newPassword);
        await (user as any).save();

        return res.status(200).json({ message: 'Password updated successfully' });
    };
}


export default new AuthServices();