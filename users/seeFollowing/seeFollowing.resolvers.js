import client from "../../client";

export default {
    Query: {
        seeFollowing: async (_, { username, lastId }) => {
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
                const following = await client.user
                    .findUnique({ where: { username } })
                    .following({
                        take: 30, 
                        skip: lastId ? 1 : 0, 
                        ...(lastId && { cursor: { id: lastId } })
                    });
                return {
                    success: true, 
                    following
                }
            };
        }
    }
};