import client from "../../client";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
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
            const existRoom = await client.room.findFirst({
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                },
                select: {
                    id: true
                }
            });
            if (existRoom) {
                return {
                    success: false, 
                    error: "The room already exists."
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
                                    id: loggedInUser.id
                                }
                            ]
                        }
                    }
                });
            };
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
    const message = await client.message.create({
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
    pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
    return {
        success: true
    };
};

export default {
    Mutation: {
        sendMessage: protectedResolver(resolverFn)
    }
};