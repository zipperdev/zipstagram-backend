import client from "../../client";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "apollo-server-express";

export default {
    Subscription: {
        roomUpdates: {
            subscribe: async (root, args, context, info) => {
                const exists = await client.room.findFirst({
                    where: {
                        id: args.id, 
                        users: {
                            some: {
                                id: context.loggedInUser.id
                            }
                        }
                    }, 
                    select: {
                        id: true
                    }
                });
                if (!exists) {
                   throw new Error("Cannot be reached the room.");
                } else {
                    return withFilter(
                        () => pubsub.asyncIterator(NEW_MESSAGE), 
                        ({ roomUpdates: { roomId } }, { id }) => {
                            return roomId === id;
                        }
                    )(root, args, context, info);
                };
            }
        }
    }
};