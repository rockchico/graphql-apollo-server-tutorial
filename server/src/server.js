import 'dotenv/config';
import cors from 'cors';
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
//import uuidv4 from 'uuid/v4';


import schema from './schema/';
import resolvers from './resolvers/';
import models from './models/';


console.log('Hello Node.js project.');
console.log(process.env.MY_DATABASE_PASSWORD);

const app = express();
app.use(cors());


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: { // passando valores via contexto aos resolvers
    models,
    me: models.users[2],
    opa: 'sim'
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})