import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { payload, roomId, userId }, { loggedInUser }) => {
    let room = null;
    if (userId) {
        const user = await client.user.findUnique({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        });
        if (!user) {
            return {
                success: false, 
                error: "This user does not exists."
            };
        } else {
            room = await client.room.create({
                data: {
                    users: {
                        connect: [
                            {
                                id: userId
                            }, 
                            {
                                id: loggedInUser
                            }
                        ]
                    }
                }
            });
        };
    } else if (roomId) {
        room = await client.room.findUnique({
            where: {
                id: roomId
            }, 
            select: {
                id: true
            }
        });
        if (!room) {
            return {
                success: false, 
                error: "Room not found."
            };
        };
    } else {
        return {
            success: false, 
            error: "Fill the roomId or the userId field."
        };
    };
    await client.message.create({
        data: {
            payload, 
            user: {
                connect: {
                    id: loggedInUser.id
                }
            }, 
            room: {
                connect: {
                    id: room.id
                }
            }
        }
    });
    return {
        success: true
    };
};

export default {
    Mutation: {
        sendMessage: protectedResolver(resolverFn)
    }
};