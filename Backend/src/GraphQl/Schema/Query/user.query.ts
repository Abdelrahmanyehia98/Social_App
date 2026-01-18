import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { SayHelloResponseType, UserType } from "../../Types/user.types";
import { SayHelloArgsType } from "../../Args/user.args";
import UserResolver from "../../Resolvers/user.resolvers";


class UserQuery {

    private userResolver: UserResolver = new UserResolver()
    register() {
        return {
            sayHello: {
                type: SayHelloResponseType,
                args: SayHelloArgsType,
                resolve: this.userResolver.sayHello
            },
            listUsers: {
                type: new GraphQLList(UserType),
                resolve: this.userResolver.listUser
            }
        }
    }
}

export default new UserQuery()