import { gql } from "apollo-server";

export default gql`
    type ToggleLikeResult {
        success: Boolean!
        error: String
    }

    type Mutation {
        toggleLike(id: Int!): ToggleLikeResult!
    }
`;