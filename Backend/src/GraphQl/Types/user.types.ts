import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";


export const SayHelloResponseType = new GraphQLObjectType({
    name: 'SayHelloResponseType',
    fields: {
        name: { type: GraphQLString, description: 'name of the person' },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        id: { type: GraphQLInt }
    }
})


export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    }
})