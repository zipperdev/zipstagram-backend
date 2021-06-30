require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const app = express();
const apollo = new ApolloServer({
    typeDefs, 
    resolvers, 
    uploads: false, 
    subscriptions: {
        onConnect: async ({ token }) => {
            if (!token) {
                throw new Error("Cannot listen subscriptions.")
            };
            const loggedInUser = await getUser(token);
            return {
                loggedInUser
            };
        }
    }, 
    context: async (context) => {
        if (context.req) {
            return {
                loggedInUser: await getUser(context.req.headers.token)
            };
        } else {
            const { loggedInUser } = context.connection.context;
            return {
                loggedInUser
            };
        };
    }
});

app.use(logger("tiny"));
app.use(graphqlUploadExpress());
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`✅ Server : http://localhost:${PORT}`)
});