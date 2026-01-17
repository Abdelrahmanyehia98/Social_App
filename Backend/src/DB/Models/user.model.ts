import mongoose from "mongoose";
import { RoleEnum ,ProviderEnum,GenderEnum, OtpTypesEnum ,IUser } from "../../Common";
import { decrypt, encrypt, generateHash, S3ClientService } from "../../Utils";
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

/** Apply Document hook to hash password and encrypt phone number before saving a document*/
UserSchema.pre('save', function () {
    if (this.isModified("password")) {
        // hash password
        this.password = generateHash(this.password as string)
    }

    if (this.isModified("phoneNumber")) {
        // Encrypt phone number  
        this.phoneNumber = encrypt(this.phoneNumber as string)
    }

})
/** Apply Query hook to decrypt phone number if exists after any method starts with find*/
UserSchema.post(/^find/, function (doc) {

    if (doc) {
        if ((this as unknown as { op: string }).op == 'find') {
            doc.forEach((user: IUser) => {
                if (user.phoneNumber) {
                    user.phoneNumber = decrypt(user.phoneNumber as string)
                }
            })
        } else {
            doc.phoneNumber ? doc.phoneNumber = decrypt(doc.phoneNumber as string) : doc.phoneNumber = undefined
        }
    }
})
/**Apply Query hook to delete profile picture from S3 after deleting user*/
UserSchema.post('findOneAndDelete', async function (doc) {

    // Delete User Pictures
    const S3Service = new S3ClientService()
    if (doc.profilePicture) {
        await S3Service.DeleteFileFromS3(doc.profilePicture)
        console.log(`User's profile picture deleted successfully`);
    }
    if (doc.coverPicture) {
        await S3Service.DeleteFileFromS3(doc.coverPicture)
        console.log(`User's cover picture deleted successfully`);
    }

})

const UserModel = mongoose.model('User',UserSchema)
export {UserModel}