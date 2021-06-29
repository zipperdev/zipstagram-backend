import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id, payload }, { loggedInUser }) => {
    const comment = await client.comment.findUnique({
        where: {
            id
        }, 
        select: {
            userId: true
        }
    });
    if (!comment || comment.userId !== loggedInUser.id) {
        return {
            success: false, 
            error: "Comment not found."
        };
    } else {
        await client.comment.update({
            where: {
                id
            }, 
            data: {
                payload
            }
        });
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        editComment: protectedResolver(resolverFn)
    }
};