import { Request, Response } from "express";
import { BadRequestException, encrypt, generateHash, S3ClientService } from "../../../Utils";
import { IRequest, IUser } from "../../../Common";
import { SuccessResponse } from "../../../Utils"
import { UserModel } from "../../../DB/Models";
import { UserRepository } from "../../../DB/Repositories";



export class profileService {
    private s3Client = new S3ClientService()
    private userRepo = new UserRepository(UserModel)


    uploadProfilePicture = async (req: Request, res: Response) => {
        const { file } = req
        const { user } = (req as unknown as IRequest).loggedInUser
        if (!file) throw new BadRequestException("Please upload a file")

        const uploaded = await this.s3Client.uploadLargeFileOnS3(file, `${user._id}/profile`)

        // user.profilePicture = Key
        // await user.save()

        res.json(SuccessResponse("Profile picture uploaded successfully", 200, uploaded))

    }

    renewSignedUrl = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const { key, keyType }: { key: string, keyType: "profilePicture" | "coverPicture" } = req.body

        if (!user[keyType] || user[keyType] !== key) {
          throw new BadRequestException("Invalid key");
        }

        const url = await this.s3Client.getFileWithSignedUrl(key)
        res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, { key, url }))
    }

    deleteAccount = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const userId = user._id;
        const deletedDocument = await this.userRepo.deleteByIdDocument(userId as string)
        if (!deletedDocument) throw new BadRequestException("Account not found")
        
        
        let deleteResponse;
        if (deletedDocument?.profilePicture) {
            deleteResponse = await this.s3Client.DeleteFileFromS3(deletedDocument.profilePicture)
        }

        res.json(SuccessResponse<unknown>('Account deleted successfully', 200, deleteResponse))
    }

    updateProfile = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser;
        const { firstName, lastName, email, password, gender, phoneNumber, DOB } = req.body;


        const updateData: Partial<IUser> = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (password) updateData.password = generateHash(password);
        if (gender) updateData.gender = gender;
        if (phoneNumber) updateData.phoneNumber = encrypt(phoneNumber);
        if (DOB) updateData.DOB = DOB;

        const updatedUser = await this.userRepo.updateOneDocument(
        { _id: user._id }, 
        { $set: updateData },
        { new: true }
        );
        res.json(SuccessResponse<unknown>('Profile updated successfully', 200,updatedUser))
    }

}


export default new profileService();