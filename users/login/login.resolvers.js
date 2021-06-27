import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../..//client";

export default {
    Mutation: {
        login: async (
            _, 
            { email, password }
        ) => {
            const user = await client.user.findFirst({
                where: {
                    email
                }
            });
            if (!user) {
                return {
                    success: false, 
                    error: "User not found."
                };
            } else {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return {
                        success: false, 
                        error: "Incorrect password."
                    };
                } else {
                    const token = await jwt.sign({ id: user.id }, process.env.TOKEN_KEY, { expiresIn: "28 days" });
                    return {
                        success: true, 
                        token
                    };
                };
            };
        }
    }
};