import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
    let hashtagObjs = [];
    if (caption) {
        hashtagObjs = processHashtags(caption);
    };
    return client.photo.create({
        data: {
            file, 
            ...(caption && { caption }), 
            user: {
                connect: {
                    id: loggedInUser.id
                }
            }, 
            ...(hashtagObjs.length > 0 && {
                hashtags: {
                    connectOrCreate: hashtagObjs
                }
            })
        }
    });
};

export default {
    Mutation: {
        uploadPhoto: protectedResolver(resolverFn)
    }
};