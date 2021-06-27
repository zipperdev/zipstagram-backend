import { gql } from "apollo-server";

export default gql`
    type FollowUserResult {
        success: Boolean!
        error: String
    }

    type Mutation {
        followUser(username: String!): FollowUserResult!
    }
`;