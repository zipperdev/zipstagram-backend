import { gql } from "apollo-server";

export default gql`
    scalar Upload

    type MutationResponse {
        success: Boolean!
        id: Int
        error: String
    }
`;