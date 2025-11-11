import { NextFunction, Request, Response } from "express"
import { IUser, OtpTypesEnum } from "../../../Common"
import { UserRepository } from "../../../DB/Repositories/user.repository"
import { UserModel } from "../../../DB/Models"
import { encrypt, generateHash, localEmitter } from "../../../Utils"


class AuthServices {

    private userRepo : UserRepository = new UserRepository(UserModel)
    signUp = async(req:Request, res:Response, next:NextFunction) =>{
        const {firstName , lastName, email, password, gender, DOB ,phoneNumber }: Partial<IUser> =req.body
        
        const isEmailExists = await this.userRepo.findOneDocument({email},'email');
        if(!isEmailExists) return res.status(400).json({message:'email already exists'})

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
        return res.status(201).json({message : 'user created successfully',data:{newUser}})

    }
}

export default new AuthServices();