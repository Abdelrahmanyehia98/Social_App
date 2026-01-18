import { UserRepository } from "../../DB/Repositories"

class UserResolver {

    private userRepo: UserRepository = new UserRepository()

    sayHello = (__: any, args: any, context: any) => {
        return { ...args, id: 8 }
    }

    listUser = async (__: any, args: any, context: any) => {
        return await this.userRepo.findDocuments()
    }
}

export default UserResolver