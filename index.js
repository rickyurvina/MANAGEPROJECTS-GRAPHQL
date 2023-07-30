const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const connectDb = require('./config/db')

connectDb();

const server = new ApolloServer(
    {
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers['authorization'] || '';
            console.log({ token })
            if (token) {
                try {
                    const user = jwt.verify(token.replace('Bearer ', ''), "secret");
                    console.log(user);
                    return {
                        user
                    }
                } catch (error) {
                    console.log({ error });
                }
            }
        }
    });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})