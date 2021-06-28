import { gql } from "apollo-server";

export default gql`
    type EditPhotoResult {
        success: Boolean!
        error: String
    }

    type Mutation {
        editPhoto(
            id: Int!, 
            caption: String!
        ): EditPhotoResult!
    }
`;