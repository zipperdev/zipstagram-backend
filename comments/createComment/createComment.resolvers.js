import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { photoId, payload }, { loggedInUser }) => {
    const exists = await client.photo.findUnique({ where: { id: photoId }, select: { id: true } });
    if (!exists) {
        return {
            success: false,
            error: "Photo not found."
        };
    } else {
        const newComment = await client.comment.create({
            data: {
                photo: {
                    connect: {
                        id: photoId
                    }
                },
                user: {
                    connect: {
                        id: loggedInUser.id
                    }
                },
                payload
            }
        });
        return {
            success: true,
            id: newComment.id
        };
    };
};

export default {
    Mutation: {
        createComment: protectedResolver(resolverFn)
    }
}