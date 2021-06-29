import client from "../../client";

export default {
    Query: {
        seePhotoLikes: async (_, { id, lastId }) => {
            const likedUsers = await client.like.findMany({
                where: {
                    photoId: id
                }, 
                select: {
                    user: true
                }, 
                take: 30, 
                skip: lastId ? 1 : 0, 
                ...(lastId && { cursor: { id: lastId } })
            });
            return likedUsers.map(like => like.user);
        }
    }
};