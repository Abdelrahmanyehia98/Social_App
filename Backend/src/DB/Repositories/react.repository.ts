import { FilterQuery, PaginateOptions } from "mongoose";
import { IReact } from "../../Common";
import { ReactModel } from "../Models";
import { BaseRepository } from "./base.repository";

export class ReactRepository extends BaseRepository<IReact> {
    constructor() {
        super(ReactModel)
    }

    private reactModel = ReactModel

    listReactions = async (
        filters: FilterQuery<IReact>,
        options: PaginateOptions
    ) => {
        return await this.reactModel.paginate(filters, options)
    }
}