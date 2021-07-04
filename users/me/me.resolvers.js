import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = (_, __, { loggedInUser }) => client.user.findUnique({
    where: {
        id: loggedInUser.id
    }
})

export default {
    Query: {
        me: protectedResolver(resolverFn)
    }
}