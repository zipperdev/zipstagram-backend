import { gql } from "apollo-server";

export default gql`
    type SeeFollowingResult {
        success: Boolean!
        error: String
        following: [User]
    }

    type Query {
        seeFollowing(username: String!, lastId: Int): SeeFollowingResult!
    }
`;