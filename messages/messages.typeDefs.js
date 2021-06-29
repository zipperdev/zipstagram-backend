import { gql } from "apollo-server";

export default gql`
    type Message {
        id: Int!
        payload: String!
        user: User!
        room: Room!
        createdAt: String!
        updatedAt: String!
    }

    type Room {
        id: Int!
        users(lastId: Int): [User]
        messages(lastId: Int): [Message]
        createdAt: String!
        updatedAt: String!
    }
`;