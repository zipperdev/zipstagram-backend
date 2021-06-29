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
        })
    }
};