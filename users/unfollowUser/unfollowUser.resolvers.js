import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    const userExists = await client.user.findUnique({ where: { username } });
    if (!userExists) {
        return {
            success: false, 
            error: "Cannot unfollow user."
        };
    } else {
        await client.user.update({
            where: {
                id: loggedInUser.id
            }, 
            data: {
                following: {
                    disconnect: {
                        username
                    }
                }
            }
        });
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        unfollowUser: protectedResolver(resolverFn)
    }
};