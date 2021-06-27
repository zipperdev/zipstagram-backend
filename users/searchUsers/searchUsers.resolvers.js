import client from "../../client";

export default {
    Query: {
        searchUsers: async (_, { keyword, lastId }) => client.user.findMany({
                where: {
                    OR: [
                        {
                            username: {
                                startsWith: keyword.toLowerCase()
                            }
                        }, 
                        {
                            firstName: {
                                startsWith: keyword
                            }
                        }, 
                        {
                            lastName: {
                                startsWith: keyword
                            }
                        }
                    ]
                }, 
                take: 5, 
                skip: lastId ? 1 : 0, 
                ...(lastId && { cursor: { id: lastId } })
            })
    }
};