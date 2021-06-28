import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolverFn = async (_, { id, caption }, { loggedInUser }) => {
    const oldPhoto = await client.photo.findFirst({
        where: {
            id, 
            userId: loggedInUser.id
        }, 
        include: {
            hashtags: {
                select: {
                    hashtag: true
                }
            }
        }
    });
    if (!oldPhoto) {
        return {
            success: false, 
            error: "Photo not found."
        }
    } else {
        await client.photo.update({
            where: {
                id
            }, 
            data: {
                caption, 
                hashtags: {
                    disconnect: oldPhoto.hashtags, 
                    connectOrCreate: processHashtags(caption)
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
        editPhoto: protectedResolver(resolverFn)
    }
};