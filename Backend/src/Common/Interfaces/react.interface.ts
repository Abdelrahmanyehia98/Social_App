import { Types } from "mongoose";
import { ReactOnModelEnum, ReactTypeEnum } from "../Enums/user.enum";


export interface IReact {
    _id?: Types.ObjectId;
    ownerId: Types.ObjectId;
    refId: Types.ObjectId;
    onModel: ReactOnModelEnum;
    type: ReactTypeEnum;
    createdAt?: Date;
    updatedAt?: Date;
}