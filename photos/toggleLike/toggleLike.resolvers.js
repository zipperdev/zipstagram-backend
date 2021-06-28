import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
    const photo = await client.photo.findUnique({ where: { id } });
    if (!photo) {
        return {
            success: false, 
            error: "Photo not found."
        };
    } else {
        const like = await client.like.findUnique({
            where: {
                photoId_userId: {
                    userId: loggedInUser.id, 
                    photoId: id
                }
            }
        });
        if (like) {
            await client.like.delete({
                where: {
                    photoId_userId: {
                        userId: loggedInUser.id, 
                        photoId: id
                    }
                }
            });
        } else {
            await client.like.create({
                data: {
                    user: {
                        connect: {
                            id: loggedInUser.id
                        }
                    }, 
                    photo: {
                        connect: {
                            id: photo.id
                        }
                    }
                }
            });
        };
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        toggleLike: protectedResolver(resolverFn)
    }
};