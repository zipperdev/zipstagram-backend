import client from "../../client";
import { PrismaDelete } from "@paljs/plugins";
import { protectedResolver } from "../../users/users.utils";
import { removeToS3 } from "../../shared/shared.utils";

const prismaDelete = new PrismaDelete(client);

const resolverFn = async (_, { id }, { loggedInUser }) => {
    const photo = await client.photo.findUnique({
        where: {
            id
        }, 
        select: {
            userId: true, 
            file: true
        }
    });
    if (!photo || photo.userId !== loggedInUser.id) {
        return {
            success: false, 
            error: "Photo not found."
        };
    } else {
        await prismaDelete.onDelete({
            model: "Photo", 
            where: {
                id
            }, 
            deleteParent: true
        });
        await removeToS3(photo.file, "uploads");
        return {
            success: true
        };
    };
};

export default {
    Mutation: {
        deletePhoto: protectedResolver(resolverFn)
    }
};