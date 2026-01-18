import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";

export const SayHelloArgsType = {
    name: { type: GraphQLString, description: 'name of the person' },
    age: { type: new GraphQLNonNull(GraphQLInt) }
}


