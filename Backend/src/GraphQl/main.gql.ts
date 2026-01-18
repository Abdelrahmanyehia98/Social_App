import { GraphQLInt, GraphQLObjectType, GraphQLSchema } from "graphql";
import userQuery from "./Schema/Query/user.query";

export const MainSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'QueryMainSchema',
        description: 'This the query main schema',
        fields: {
            ...userQuery.register()
            // spreading for post Query
            // spreading for comment Query
            // spreading for react Query
        }
    }),
    mutation: new GraphQLObjectType({
        name: "MutationMainSchema",
        description: 'test dec',
        fields: {
            mtionHello: {
                type: GraphQLInt,
                resolve: () => {
                    return 876658
                }
            }
        }
    })
})