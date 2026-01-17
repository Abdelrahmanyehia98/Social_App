import { IUser } from "../../Common";
import { BaseRepository } from "./base.repository";
import { UserModel } from "../Models";


export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel)
    }
}
