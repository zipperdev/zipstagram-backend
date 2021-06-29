import client from "../../client";

export default {
    Query: {
        seePhotoComments: (_, { id, lastId }) => client.comment.findMany({
            where: { photoId: id }, 
            orderBy: { createdAt: "desc" }, 
            take: 40, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        })
    }
};