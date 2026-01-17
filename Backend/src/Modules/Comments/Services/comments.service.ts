import { NextFunction, Request, Response } from "express"
import { IRequest } from "../../../Common"
import { CommentRepository, PostRepository } from "../../../DB/Repositories"
import { BadRequestException, S3ClientService } from "../../../Utils"

class CommentService {
    private commentRepo = new CommentRepository()
    private postRepo = new PostRepository()
    private s3ClientService = new S3ClientService()

    addCommentOrReply = async (req: Request, res: Response, next: NextFunction) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { content, refId, onModel } = req.body

        const file = req.file as Express.Multer.File

        if (!content && !file) throw new BadRequestException('Content or attachments is required')

        let attachments: string[] = []

        if (file) {
            const { key } = await this.s3ClientService.UploadFileOnS3(
            file,
            `${_id}/${refId}/comments`
            )
            attachments.push(key)
        }

        if (onModel == 'Post') {
            const post = await this.postRepo.findOneDocument({ _id: refId, allowComments: true })
            if (!post) throw new BadRequestException('Invalid post id')
        } else if (onModel == 'Comment') {
            const comment = await this.commentRepo.findDocumentById(refId)
            if (!comment) throw new BadRequestException('Invalid comment id')
        }

        const comment = await this.commentRepo.createNewDocument({
            content,
            attachments,
            ownerId: _id,
            refId,
            onModel
        })

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comment
        })
    }
}

export default new CommentService()