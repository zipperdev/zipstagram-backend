import client from "../../client";

export default {
    Query: {
        seeFollowers: async (_, { username, lastId }) => {
            const userExists = await client.user.findUnique({
                where: { username }, 
                select: { id: true }
            });
            if (!userExists) {
                return {
                    success: false, 
                    error: "User not found."
                };
            } else {
                const followers = await client.user
                    .findUnique({ where: { username } })
                    .followers({
                        take: 5, 
                        skip: lastId ? 1 : 0, 
                        ...(lastId && { cursor: { id: lastId } })
                    });
                const totalFollowers = await client.user.count({
                    where: {
                        following: {
                            some: { username }
                        }
                    }
                })
                return {
                    success: true, 
                    followers, 
                    totalPages: Math.ceil(totalFollowers / 5)
                };
            };
        }
    }
};