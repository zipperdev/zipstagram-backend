import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = (_, { id }, { loggedInUser }) => client.room.findFirst({
    where: {
        id, 
        users: {
            some: {
                id: loggedInUser.id
            }
        }
    }
});

export default {
    Query: {
        seeRoom: protectedResolver(resolverFn)
    }
};