import { gql } from "apollo-server";

export default gql`
    type User {
        id: Int!
        verified: Boolean!
        verifyCode: String!
        firstName: String!
        lastName: String
        username: String!
        email: String!
        bio: String
        avatar: String
        photos(lastId: Int): [Photo]
        totalFollowing: Int!
        totalFollowers: Int!
        isMe: Boolean!
        isFollowing: Boolean!
        createdAt: String!
        updatedAt: String!
    }
`;