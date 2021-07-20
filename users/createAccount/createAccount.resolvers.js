import bcrypt from "bcrypt";
import client from "../../client";
import { sendMail } from '../../utils';

export default {
    Mutation: {
        createAccount: async (
            _,
            { firstName, lastName, username, email, password }
        ) => {
            if (password.length < 8) {
                return {
                    success: false,
                    error: "Password must be longger than 7."
                };
            } else {
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
                    if (existingUser && existingUser.verified === true) {
                        throw new Error("This username or password is already taken.");
                    } else {
                        if (existingUser?.verified === false) {
                            await client.user.delete({
                                where: {
                                    email
                                }
                            });
                        };
                        const cryptedPassword = await bcrypt.hash(password, 10);
                        const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
                        const cryptedVerifyCode = await bcrypt.hash(verifyCode, 6);
                        await client.user.create({
                            data: {
                                verifyCode: cryptedVerifyCode, 
                                username, 
                                email, 
                                firstName, 
                                lastName, 
                                password: cryptedPassword
                            }
                        });
                        sendMail(
                            email, 
                            "Email Verify from Zipstagram", 
                            `<h1>Hi ${username}!</h1><br/><p>This is verify code : <b>${verifyCode}</b></p><small>Thank you for visit Zipstagram</small>`
                        );
                        return {
                            success: true
                        };
                    };
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        error: "Cannot create account."
                    };
                };
            };
        }
    }
};