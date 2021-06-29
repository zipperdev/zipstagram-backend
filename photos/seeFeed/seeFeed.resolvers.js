import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = (_, { lastId }, { loggedInUser }) => client.photo.findMany({
    where: {
        OR: [
            {
                user: {
                    followers: {
                        some: {
                            id: loggedInUser.id
                        }
                    }
                }
            }, 
            {
                userId: loggedInUser.id
            }
        ]
    }, 
    orderBy: {
        createdAt: "desc"
    }, 
    take: 40, 
    skip: lastId ? 1 : 0, 
    ...(lastId && { cursor: { id: lastId } })
});

export default {
    Query: {
        seeFeed: protectedResolver(resolverFn)
    }
};