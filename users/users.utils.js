import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
    try {
        if (!token) {
            return null;
        };
        const { id } = await jwt.verify(token, process.env.TOKEN_KEY);
        const user = await client.user.findUnique({ where: { id } });
        if (user) {
            return user;
        } else {
            return null;
        };
    } catch (error) {
        return null;
    };
};

export const protectedResolver = (selectedResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
        const query = info.operation.operation === "query";
        if (query) {
            return null;
        } else {
            return {
                success: false, 
                error: "Please login to perform this action."
            };
        };
    } else {
        return selectedResolver(root, args, context, info);
    };
};