import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
    const message = await client.message.findFirst({
        where: {
            id, 
            userId: {
                not: loggedInUser.id
            }, 
            room: {
                users: {
                    some: {
                        id: loggedInUser.id
                    }
                }
            }
        }, 
        select: {
            id: true
        }
    });
    if (!message) {
        return {
            success: false, 
            error: "Message not found."
        };
    } else {
        await client.message.update({
            where: {
                id
            }, 
            data: {
                read: true
            }
        });
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        readMessage: protectedResolver(resolverFn)
    }
};