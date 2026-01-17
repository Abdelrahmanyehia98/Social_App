import mongoose, { PaginateModel } from "mongoose";
import { IComment } from "../../Common";
import mongoosePaginate from "mongoose-paginate-v2"

const commentSchema = new mongoose.Schema<IComment>({

    content: String,
    attachments: String,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    }
},
{
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

commentSchema.plugin(mongoosePaginate)


// replies for comment
commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'refId'
})

export const CommentModel = mongoose.model< IComment, PaginateModel<IComment> >('Comment', commentSchema)