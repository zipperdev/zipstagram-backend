import client from "../client";

export default {
    Photo: {
        user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
        hashtags: ({ id }) => client.hashtag.findMany({ where: { photos: { some: { id } } } }),
        likes: ({ id }) => client.like.count({ where: { photoId: id } }),
        commentCount: ({ id }) => client.comment.count({ where: { photoId: id } }),
        comments: ({ id }, { lastId }) => client.comment.findMany({
            where: { photoId: id },
            include: {
                user: true
            },
            orderBy: { createdAt: "desc" },
            take: 40,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } })
        }),
        isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
        isLiked: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            } else {
                const success = await client.like.findUnique({
                    where: {
                        photoId_userId: {
                            photoId: id,
                            userId: loggedInUser.id
                        }
                    },
                    select: {
                        id: true
                    }
                });
                return Boolean(success);
            };
        }
    },
    Hashtag: {
        photos: ({ id }, { lastId }) => client.hashtag.findUnique({
            where: {
                id
            }
        })
            .photos({
                take: 40,
                skip: lastId ? 1 : 0,
                ...(lastId && { cursor: { id: lastId } })
            }),
        totalPhotos: ({ id }) => client.photo.count({ where: { hashtags: { some: { id } } } })
    }
};