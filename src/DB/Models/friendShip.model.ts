import mongoose from "mongoose"
import { FriendShipStatusEnum , IFriendShip} from "../../Common"

const friendshipSchema = new mongoose.Schema<IFriendShip>({
    
    requestFromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requestToId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: FriendShipStatusEnum,
        default: FriendShipStatusEnum.PENDING
    }
})

export const FriendshipModel = mongoose.model<IFriendShip>('Friendship', friendshipSchema)