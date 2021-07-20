import { gql } from "apollo-server";

export default gql`
    type Mutation {
        verifyEmail(
            email: String!
            verifyCode: String!
        ): MutationResponse!
    }
`;