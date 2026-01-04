import mongoose from "mongoose";
import { IBlackListedToken } from "../../Common";

const blackListedTokenSchema = new mongoose.Schema<IBlackListedToken>({
    tokenId:{
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})


const BlacklistedTokensModel = mongoose.model<IBlackListedToken>("BlackListedTokens", blackListedTokenSchema);
export { BlacklistedTokensModel } 