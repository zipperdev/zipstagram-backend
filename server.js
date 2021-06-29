require("dotenv").config();
import express from "express";
import logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
    typeDefs, 
    resolvers, 
    uploads: false, 
    context: async ({ req }) => {
        return {
            loggedInUser: await getUser(req.headers.token)
        };
    }
});
const app = express();

app.use(graphqlUploadExpress());
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });
app.listen({ port: PORT }, () => {
    console.log(`✅ Server : http://localhost:${PORT}`)
});