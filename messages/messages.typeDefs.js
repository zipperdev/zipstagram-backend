import { gql } from "apollo-server";

export default gql`
    type Message {
        id: Int!
        user: User!
        room: Room!
        payload: String!
        read: Boolean!
        isMine: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type Room {
        id: Int!
        users(lastId: Int): [User]
        messages(lastId: Int): [Message]
        unreadTotal: Int!
        createdAt: String!
        updatedAt: String!
    }
`;