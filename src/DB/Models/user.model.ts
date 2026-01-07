import mongoose from "mongoose";
import { RoleEnum ,ProviderEnum,GenderEnum, OtpTypesEnum ,IUser } from "../../Common";
const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
        type:String,
        required:true,
        minlength:[4 ,'First Name must be at least 4 characters long']
    },
    lastName: {
        type:String,
        required:true,
        minlength:[4 ,'Last Name must be at least 4 characters long']
    },
    email: {
        type:String,
        required:true,
        index:{
            unique:true,
            name: 'idx_email_unique'
        }
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    role : {
        type:String,
        enum:RoleEnum,
        default: RoleEnum.USER
    },
    gender : {
        type:String,
        enum: GenderEnum,
        default: GenderEnum.OTHER
    },
    DOB:String,
    profilePicture:String,
    coverPicture:String,
    provider : {
        type:String,
        enum: ProviderEnum,
        default:ProviderEnum.LOCAL
    },
    googleId:String,
    phoneNumber:String,
    OTPS: [{
        value: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now() + 600000 },  
        otpType: { type: String, enum: OtpTypesEnum, required: true },

    }]
})

const UserModel = mongoose.model('User',UserSchema)
export {UserModel}