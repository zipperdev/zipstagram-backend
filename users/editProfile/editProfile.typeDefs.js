import { gql } from "apollo-server";

export default gql`
    type Mutation {
        editProfile(
            firstName: String
            lastName: String
            username: String
            password: String
            bio: String
            avatar: Upload
        ): MutationResponse!
    }
`;