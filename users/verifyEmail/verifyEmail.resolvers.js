import client from "../../client";
import bcrypt from "bcrypt";

export default {
    Mutation: {
        verifyEmail: async (_, { email, verifyCode }) => {
            const user = await client.user.findUnique({ where: { email }, select: { verified: true, verifyCode: true } });
            if (!user) {
                return {
                    success: false, 
                    error: "That user does not exist."
                };
            } else if (user.verified === true) {
                return {
                    success: false, 
                    error: "That user already verified."
                };
            } else {
                const compare = await bcrypt.compare(verifyCode, user.verifyCode);
                if (!compare) {
                    return {
                        success: false, 
                        error: "Verify code does not same."
                    };
                } else {
                    await client.user.update({
                        where: { email }, 
                        data: {
                            verified: true
                        }
                    });
                    return {
                        success: true
                    };
                };
            };
        }
    }
};