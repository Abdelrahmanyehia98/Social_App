import { Request, Response } from "express";
import { IRequest } from "../../../Common";
import { ReactRepository, PostRepository, CommentRepository } from "../../../DB/Repositories";
import { BadRequestException } from "../../../Utils";
import { ReactOnModelEnum, ReactTypeEnum } from "../../../Common";

class ReactService {
    private reactionRepo = new ReactRepository();
    private postRepo = new PostRepository();
    private commentRepo = new CommentRepository();

    // React OR Update React
    react = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser;
        const { refId, onModel, type } = req.body;

        if (!refId || !onModel)
            throw new BadRequestException("refId and onModel are required");

        if (onModel === ReactOnModelEnum.POST) {
            const post = await this.postRepo.findDocumentById(refId);
            if (!post) throw new BadRequestException("Invalid post id");
        }

        if (onModel === ReactOnModelEnum.COMMENT) {
            const comment = await this.commentRepo.findDocumentById(refId);
            if (!comment) throw new BadRequestException("Invalid comment id");
        }

        const existingReact = await this.reactionRepo.findOneDocument({
            ownerId: _id,
            refId,
            onModel
        });

        if (existingReact) {
            const updatedReact = await this.reactionRepo.updateOneDocument(
                { _id: existingReact._id },
                { type: type || ReactTypeEnum.LIKE }
            );

            return res.status(200).json({
                success: true,
                message: "Reaction updated successfully",
                data: updatedReact
            });
        }

        const react = await this.reactionRepo.createNewDocument({
            ownerId: _id,
            refId,
            onModel,
            type: type || ReactTypeEnum.LIKE
        });

        return res.status(201).json({
            success: true,
            message: "Reacted successfully",
            data: react
        });
    };

    // UnReact
    unReact = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser;
        const { refId, onModel } = req.body;

        if (!refId || !onModel)
            throw new BadRequestException("refId and onModel are required");

        const react = await this.reactionRepo.findOneDocument({
            ownerId: _id,
            refId,
            onModel
        });

        if (!react)
            throw new BadRequestException("Reaction not found");

        await this.reactionRepo.deleteOneDocument({ _id: react._id });

        return res.status(200).json({
            success: true,
            message: "Unreacted successfully"
        });
    };

    // List reactions
    listReactions = async (req: Request, res: Response) => {
        const { refId, onModel, page, limit } = req.query;

        if (!refId || !onModel)
            throw new BadRequestException("refId and onModel are required");

        const reactions = await this.reactionRepo.listReactions(
            {
                refId,
                onModel
            },
            {
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                populate: [
                    {
                        path: "ownerId",
                        select: "firstName lastName profilePicture"
                    }
                ]
            }
        );

        return res.status(200).json({
            success: true,
            message: "Reactions fetched successfully",
            data: reactions
        });
    };
}

export default new ReactService();
