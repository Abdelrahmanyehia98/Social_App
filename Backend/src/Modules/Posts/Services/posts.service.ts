import { NextFunction, Request, Response } from "express"
import { FriendShipRepository, PostRepository, UserRepository } from "../../../DB/Repositories"
import { FriendShipStatusEnum, IPost, IRequest } from "../../../Common"
import { BadRequestException, pagination, S3ClientService } from "../../../Utils"
import { FilterQuery, Types } from "mongoose"

class PostService {
    private postRepo = new PostRepository()
    private userRepo = new UserRepository()
    private friendShipRepo = new FriendShipRepository()
    private S3ClientService = new S3ClientService()


    addPost = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { description, allowComments, tags } = req.body  // ['' ,''] , $in , $addToSet
        const files = req.files as Express.Multer.File[]

        if (!description && (files && !files.length)) throw new BadRequestException('Description or files is required')

        let uniqueTags: Types.ObjectId[] = []
        if (tags) {
            const users = await this.userRepo.findDocuments({ _id: { $in: tags } })
            if (users.length !== tags.length) throw new BadRequestException('Invalid tags ==========')

            // validate friends
            // use populate instead of  userRepo
            const friends = await this.friendShipRepo.findDocuments({
                status: FriendShipStatusEnum.ACCEPTED,
                $or: [
                    { requestFromId: _id, requestToId: { $in: tags } },
                    { requestFromId: { $in: tags }, requestToId: _id }
                ]
            })
            if (friends.length !== tags.length) throw new BadRequestException('Invalid tags')

            uniqueTags = Array.from(new Set(tags))
        }

        let attachments: string[] = []
        if (files?.length) {
            const uploadedData = await this.S3ClientService.UploadFilesOnS3(files, `${_id}/posts`)
            attachments = uploadedData.map(({ key }) => (key))
        }

        const post = await this.postRepo.createNewDocument({
            description,
            attachments,
            ownerId: _id,
            allowComments,
            tags: uniqueTags
        })

        return res.status(201).json({
            success: true,
            message: 'Post added successfully',
            data: post
        })
    }


    listPosts = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { page, limit, userId, home } = req.query

        // we need to use either userId or home not both
        if (userId && home) throw new BadRequestException('Invalid query parameters please use either userId or home')

        const { limit: currentLimit } = pagination({ page: Number(page), limit: Number(limit) })

        // get user's own posts be default
        const filters: FilterQuery<IPost> = { ownerId: _id }

        // get posts for specific user 
        if (userId) filters.ownerId = userId

        // get posts for home exclude user's own posts
        if (home !== 'false') filters.ownerId = { $ne: _id }


        const posts = await this.postRepo.postsPagination(
            filters,
            {
                select: 'description',
                limit: currentLimit,
                page: Number(page),
                customLabels: {
                    totalDocs: 'totalPosts',
                    docs: 'posts',
                    page: 'currentPage',
                    totalPages: 'totalPages',
                    pagingCounter: 'pagingCounter',
                    hasPrevPage: 'hasPrevPage',
                    hasNextPage: 'hasNextPage',
                    prevPage: 'prevPage',
                    nextPage: 'nextPage',
                    meta: 'meta'
                },
                populate: [
                    {
                        path: 'ownerId',
                        select: 'firstName lastName'
                    },
                    {
                        path: 'comments',
                        populate: [
                            {
                                path: 'ownerId',
                                select: 'firstName lastName'
                            },
                            {
                                path: 'replies',
                                populate: [
                                    {
                                        path: 'ownerId',
                                        select: 'firstName lastName'
                                    },
                                    {
                                        path: 'replies',
                                        populate: [
                                            {
                                                path: 'ownerId',
                                                select: 'firstName lastName'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data: { posts }
        })
    }

    listFriendsPosts = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { page, limit } = req.query

        const { limit: currentLimit } = pagination({ page: Number(page), limit: Number(limit) })

        const friends = await this.friendShipRepo.findDocuments({
            status: FriendShipStatusEnum.ACCEPTED,
            $or: [
                { requestFromId: _id },
                { requestToId: _id }
            ]
        })
        const friendsIds = friends.map((friend) => friend.requestFromId == _id ? friend.requestToId : friend.requestFromId)

        const posts = await this.postRepo.postsPagination(
            {
                ownerId: { $in: friendsIds }
            },
            {
                select: 'description attachments updatedAt',
                limit: currentLimit,
                page: Number(page),
                customLabels: {
                    totalDocs: 'totalPosts',
                    docs: 'posts',
                    page: 'currentPage',
                    totalPages: 'totalPages',
                    pagingCounter: 'pagingCounter',
                    hasPrevPage: 'hasPrevPage',
                    hasNextPage: 'hasNextPage',
                    prevPage: 'prevPage',
                    nextPage: 'nextPage',
                    meta: 'meta'
                },
                sort: { updatedAt: -1 },
                populate: [
                    {
                        path: 'ownerId',
                        select: 'firstName lastName profilePicture'
                    }
                ]
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data: { posts }
        })
    }
}


export default new PostService()