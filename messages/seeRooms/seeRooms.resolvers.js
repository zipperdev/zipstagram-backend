import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { lastId }, { loggedInUser }) => client.room.findMany({
    where: {
        users: {
            some: {
                id: loggedInUser.id
            }
        }
    }, 
    take: 20, 
    skip: lastId ? 1 : 0, 
    ...(lastId && { cursor: { id: lastId } })
});

export default {
    Query: {
        seeRooms: protectedResolver(resolverFn)
    }
}