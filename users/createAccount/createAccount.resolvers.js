import bcrypt from "bcrypt";
import client from "../../client";

export default {
    Mutation: {
        createAccount: async (
            _, 
            { firstName, lastName, username, email, password }
        ) => {
            try {
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [
                            {
                                username
                            }, 
                            {
                                email
                            }
                        ]
                    }
                });
                if (existingUser) {
                    throw new Error("This username or password is already taken.");
                } else {
                    const cryptedPassword = await bcrypt.hash(password, 10);
                    await client.user.create({ data: {
                        username, 
                        email, 
                        firstName, 
                        lastName, 
                        password: cryptedPassword
                    } });
                    return {
                        success: true
                    };
                };
            } catch (error) {
                return {
                    success: false, 
                    error: "Cannot create account."
                };
            };
        }
    }
};