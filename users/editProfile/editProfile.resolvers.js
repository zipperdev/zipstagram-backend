import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
import { removeToS3, uploadToS3 } from "../../shared/shared.utils";

const resolverFn = async (
    _, 
    { firstName, lastName, username, email, bio, avatar, password: newPassword }, 
    { loggedInUser }
) => {
    const { avatar: oldAvatarUrl } = await client.user.findUnique({ where: { id: loggedInUser.id }, select: { avatar: true } });
    let avatarUrl = null;
    let cryptedPassword = null;
    if (avatar) {
        avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
    };
    if (newPassword) {
        cryptedPassword = await bcrypt.hash(newPassword, 10);
    };
    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id
        }, 
        data: {
            firstName, 
            lastName, 
            username, 
            email, 
            bio, 
            ...(avatarUrl && { avatar: avatarUrl }), 
            ...(cryptedPassword && { password: cryptedPassword })
        }
    });
    if (updatedUser.id) {
        await removeToS3(oldAvatarUrl, "avatars");
        return {
            success: true
        };
    } else {
        return {
            success: false, 
            error: "Could not update profile."
        };
    };
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn)
    }
};