import client from "../client";

export default {
    Room: {
        users: ({ id }, { lastId }) => client.user.findMany({
            where: { rooms: { some: { id } } }, 
            take: 30, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        }), 
        messages: ({ id }, { lastId }) => client.message.findMany({
            where: { roomId: id }, 
            take: 60, 
            skip: lastId ? 1 : 0, 
            ...(lastId && { cursor: { id: lastId } })
        }), 
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0;
            } else {
                return client.message.count({
                    where: {
                        roomId: id, 
                        read: false, 
                        user: {
                            id: {
                                not: loggedInUser.id
                            }
                        }
                    }
                });
            };
        }
    }, 
    Message: {
        user: ({ id }) => client.message.findUnique({ where: { id } }).user(), 
        isMine: async ({ id }, _, { loggedInUser }) => {
            const user = await client.message.findUnique({ where: { id } }).user();
            return user?.id === loggedInUser?.id;
        }
    }
};