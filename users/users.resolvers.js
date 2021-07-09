import client from "../client";

export default {
    User: {
        totalFollowing: ({ id }) => client.user.count({
            where: {
                followers: {
                    some: {
                        id
                    }
                }
            }
        }),
        totalFollowers: ({ id }) => client.user.count({
            where: {
                following: {
                    some: {
                        id
                    }
                }
            }
        }),
        photos: ({ id }, { lastId }) => client.user.findUnique({
            where: {
                id
            }
        }).photos({
            take: 40,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } })
        }),
        isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id,
        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            } else {
                const exists = await client.user.count({
                    where: {
                        username: loggedInUser.username,
                        following: {
                            some: {
                                id
                            }
                        }
                    }
                });
                return Boolean(exists);
            };
        }
    }
};