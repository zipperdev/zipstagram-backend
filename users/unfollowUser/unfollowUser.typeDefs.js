import { gql } from "apollo-server";

export default gql`
    type UnfollowUserResult {
        success: Boolean!
        error: String
    }

    type Mutation {
        unfollowUser(username: String!): UnfollowUserResult!
    }
`;