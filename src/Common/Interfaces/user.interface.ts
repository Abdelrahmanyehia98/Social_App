import { GenderEnum, ProviderEnum, RoleEnum } from "..";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleEnum;
    gender: GenderEnum;
    DOB: Date;
    profilePicture?: string;
    coverPicture?: string;
    provider: ProviderEnum;
    googleId?: string;
    phoneNumber?: string;
    isVerified?: boolean;
}

export  {IUser}