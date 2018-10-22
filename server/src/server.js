import cors from 'cors';
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
//import uuidv4 from 'uuid/v4';

const app = express();
app.use(cors());


let users = {
  1: {
    id: '1',
    username: 'José',
    lastname: 'Pereira da Silva',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'João',
    lastname: 'Batman',
    messageIds: [2],
  },
};

const me = users[1];

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
  3: {
    id: '3',
    text: 'bla bla bla',
    userId: '2',
  },
  4: {
    id: '4',
    text: 'opa opa opa',
    userId: '2',
  },
  5: {
    id: '5',
    text: 'ble ble ble',
    userId: '2',
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
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    
  }

  type Mutation {
    createMessage(text: String!): Message!
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
    },

    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },

  },

  Message: {
    //user: () => {
    //  return me;
    //},

    // utilizando o atributo userId da mensagem
    user: message => {
      return users[message.userId];
    },
  },


  Mutation: {
    createMessage: (parent, args, context) => {
      const id = '_' + Math.random().toString(36).substr(2, 9);
      
      const message = {
        id,
        text: args.text,
        userId: context.me.id,
      };

      // adiciona a mensagem na lista
      messages[id] = message;
      users[context.me.id].messageIds.push(id);

      return message;
    },
  },




};


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: { // passando valores via contexto aos resolvers
    me: users[2],
    opa: 'sim'
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})