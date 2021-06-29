import { gql } from "apollo-server";

export default gql`
    type Query {
        seeRooms(lastId: Int): [Room]
    }
`;