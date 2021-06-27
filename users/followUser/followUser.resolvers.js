import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    const userExists = await client.user.findUnique({ where: { username } });
    if (!userExists) {
        return {
            success: false, 
            error: "That user does not exist."
        };
    } else {
        await client.user.update({
            where: {
                id: loggedInUser.id
            }, 
            data: {
                following: {
                    connect: {
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
        followUser: protectedResolver(resolverFn)
    }
};