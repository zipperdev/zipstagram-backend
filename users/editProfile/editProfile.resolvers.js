import fs from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
    _, 
    { firstName, lastName, username, email, bio, avatar, password: newPassword }, 
    { loggedInUser }
) => {
    let avatarUrl = null;
    let cryptedPassword = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = fs.createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${newFilename}`;
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