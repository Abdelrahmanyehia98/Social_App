import { Request, Response } from "express";
import { BadRequestException, S3ClientService } from "../../../Utils";
import { IRequest, IUser } from "../../../Common";
import { SuccessResponse } from "../../../Utils"
import { UserModel } from "../../../DB/Models";
import { UserRepository } from "../../../DB/Repositories";
import { Types } from "mongoose";



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

        return res.json(SuccessResponse("Profile picture uploaded successfully", 200, uploaded))

    }

    renewSignedUrl = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const { key, keyType }: { key: string, keyType: "profilePicture" | "coverPicture" } = req.body

        if (!user[keyType] || user[keyType] !== key) {
          throw new BadRequestException("Invalid key");
        }

        const url = await this.s3Client.getFileWithSignedUrl(key)
        return res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, { key, url }))
    }

     deleteAccount = async (req: Request, res: Response) => {

        const { user: { _id } } = (req as unknown as IRequest).loggedInUser

        const deletedDocument = await this.userRepo.deleteByIdDocument(_id as Types.ObjectId)
        if (!deletedDocument) throw new BadRequestException('User not found')

        res.json(SuccessResponse<unknown>('Account deleted successfully', 200))
    }

    updateProfile = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        const { firstName, lastName, email, password, gender, phoneNumber, DOB }: IUser = req.body

        await this.userRepo.updateOneDocument(
            { _id, email },
            { $set: { firstName, lastName, password, gender, phoneNumber, DOB } },
            { new: true }
        )

        res.json(SuccessResponse<IUser>('Profile updated successfully', 200))
    }

    getProfile = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        const user = await this.userRepo.findDocumentById(_id as Types.ObjectId)
        if (!user) throw new BadRequestException('User not found')
        res.json(SuccessResponse<IUser>('Profile fetched successfully', 200, user))
    }

    listUsers = async (req: Request, res: Response) => {
        const users = await this.userRepo.findDocuments()
        res.json(SuccessResponse<IUser[]>('Profile fetched successfully', 200, users))
    }    

}


export default new profileService();