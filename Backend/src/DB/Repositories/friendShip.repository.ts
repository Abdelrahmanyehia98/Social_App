import { IFriendShip } from "../../Common";
import { FriendshipModel } from "../Models";
import { BaseRepository } from "./base.repository";

export class FriendShipRepository extends BaseRepository<IFriendShip> {
    constructor() {
        super(FriendshipModel);
    }
}