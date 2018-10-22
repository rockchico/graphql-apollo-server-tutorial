import cors from 'cors';
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

const app = express();
app.use(cors());


let users = {
  1: {
    id: '1',
    username: 'José',
    lastname: 'Pereira da Silva'
  },
  2: {
    id: '2',
    username: 'João',
    lastname: 'Batman'
  },
};

//const me = users[1];



const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
    lastname: String!
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },    
    user: (parent, args) => { 
      return users[args.id];
    },
    //me: () => {
    //  return me;
    //},
    me: (parent, args, context) => {
      
      //return context.me;
      
      let me = context.me;
      me.username = me.username + " " + context.opa;
      return me;
    },
  },
  User: {
    //username: () => 'Hans', // redefine o username de todos os registros
    //username: parent => { // parent contém os dados previamente obtidos pelo resolver
    //  return parent.username;
    //}
    username: parent => { // parent contém os dados previamente obtidos pelo resolver
      return `${parent.username} - ${parent.lastname}`;
    }
  },
};


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: { // passando valores via contexto aos resolvers
    me: users[1],
    opa: 'sim'
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})