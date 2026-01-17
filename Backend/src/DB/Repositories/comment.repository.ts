import { FilterQuery, PaginateOptions } from "mongoose";
import { IComment } from "../../Common";
import { CommentModel } from "../Models";
import { BaseRepository } from "./base.repository";


export class CommentRepository extends BaseRepository<IComment> {
    constructor() {
        super(CommentModel)
    }

    private commentModel = CommentModel

    listComments = async (filters: FilterQuery<IComment>, options: PaginateOptions) => {
        return await this.commentModel.paginate(filters, options)
    }
}