import client from "../../client";

export default {
    Query: {
        seeFollowers: async (_, { username, page }) => {
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
                        skip: (page - 1) * 5
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