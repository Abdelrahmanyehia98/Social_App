import mongoose, { PaginateModel, Schema } from "mongoose";
import { IReact, ReactOnModelEnum, ReactTypeEnum } from "../../Common";
import mongoosePaginate from "mongoose-paginate-v2"

const reactSchema = new Schema<IReact>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "onModel"
        },
        onModel: {
            type: String,
            enum: Object.values(ReactOnModelEnum),
            required: true
        },
        type: {
            type: String,
            enum: Object.values(ReactTypeEnum),
            default: ReactTypeEnum.LIKE
        }
    },
    { timestamps: true }
);

reactSchema.plugin(mongoosePaginate)

reactSchema.index({ ownerId: 1, refId: 1, onModel: 1 }, { unique: true });

export const ReactModel = mongoose.model<IReact,PaginateModel<IReact>>("React", reactSchema);