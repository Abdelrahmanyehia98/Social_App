import { Request, Response } from "express";
import { BadRequestException, S3ClientService } from "../../../Utils";
import { FriendShipStatusEnum, IFriendShip, IRequest, IUser } from "../../../Common";
import { SuccessResponse } from "../../../Utils"
import { UserModel } from "../../../DB/Models";
import { ConversationRepository, FriendShipRepository, UserRepository } from "../../../DB/Repositories";
import { FilterQuery, Types } from "mongoose";



export class profileService {
    private s3Client = new S3ClientService()
    private userRepo = new UserRepository(UserModel)
    private friendShipRepo = new FriendShipRepository()
    private conversationRepo = new ConversationRepository()



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

     sendFriendShipRequest = async (req: Request, res: Response) => {

        const { user: { _id } } = (req as IRequest).loggedInUser
        const { requestToId } = req.body

        const user = await this.userRepo.findDocumentById(requestToId)
        if (!user) throw new BadRequestException('User not found')

        this.friendShipRepo.createNewDocument({ requestFromId: _id, requestToId })

        res.json(SuccessResponse<unknown>('Friend ship request sent successfully', 200))
    }


    listRequests = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { status } = req.query

        const filters: FilterQuery<IFriendShip> = { status: status ? status : FriendShipStatusEnum.PENDING }

        if (filters.status == FriendShipStatusEnum.ACCEPTED) filters.$or = [{ requestToId: _id }, { requestFromId: _id }]
        else filters.requestToId = _id

        const requests = await this.friendShipRepo.findDocuments(
            filters,
            undefined,
            {
                populate: [
                    {
                        path: 'requestFromId',
                        select: 'firstName lastName profilePicture'
                    },
                    {
                        path: 'requestToId',
                        select: 'firstName lastName profilePicture'
                    }
                ]
            })
        res.json(SuccessResponse('Requests fetched successfully', 200,  requests))
    }


    respondToFriendShipRequest = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { friendRequestId, respone } = req.body

        const friendRequest = await this.friendShipRepo.findOneDocument({ _id: friendRequestId, requestToId: _id, status: FriendShipStatusEnum.PENDING })
        if (!friendRequest) throw new BadRequestException('Friend request not found')

        friendRequest.status = respone
        await friendRequest.save()

        res.json(SuccessResponse<IFriendShip>('Requests fetched successfully', 200, friendRequest))
    }
    
    createGroup = async (req: Request, res: Response) => {
        const { user: { _id }, } = (req as IRequest).loggedInUser
        const { name, memberIds } = req.body 
        const members = await this.userRepo.findDocuments({ _id: { $in: memberIds } })
        if (members.length !== memberIds.length) throw new BadRequestException('Members not found')

        const friendship = await this.friendShipRepo.findDocuments({
            $or: [
                { requestFromId: _id, requestToId: { $in: memberIds } },
                { requestFromId: { $in: memberIds }, requestToId: _id }
            ],
            status: FriendShipStatusEnum.ACCEPTED
        })

        if (friendship.length !== memberIds.length) throw new BadRequestException('Members not found')

        const group = await this.conversationRepo.createNewDocument({
            type: 'group',
            name,
            members: [_id, ...memberIds]
        })

        res.json(SuccessResponse('Group created successfully', 200, group))
    }   

}


export default new profileService();