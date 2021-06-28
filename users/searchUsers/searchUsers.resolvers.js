import client from "../../client";

export default {
    Query: {
        searchUsers: (_, { keyword, lastId }) => client.user.findMany({
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
                take: 30, 
                skip: lastId ? 1 : 0, 
                ...(lastId && { cursor: { id: lastId } })
            })
    }
};