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

const me = users[1];

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
  },
  2: {
    id: '2',
    text: 'By World',
  },
};



const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    message(id: ID!): Message
    messages: [Message!]

  }

  type User {
    id: ID!
    username: String!
    lastname: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
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

    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
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

  Message: {
    user: () => {
      return me;
    },
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