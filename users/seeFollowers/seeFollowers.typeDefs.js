import { gql } from "apollo-server";

export default gql`
    type SeeFollowersResult {
        success: Boolean!
        error: String
        followers: [User]
    }

    type Query {
        seeFollowers(
            username: String!, 
            lastId: Int!
        ) : SeeFollowersResult!
    }
`;