export default {
    Query: {
      
        messages: (parent, args, { models }) => {
            return Object.values(models.messages);
        },
        message: (parent, { id }, { models }) => {
            return models.messages[id];
        },
  
    },
      
    Message: {
      //user: () => {
      //  return me;
      //},
  
      // utilizando o atributo userId da mensagem
      user: (message, args, { models }) => {
        return users[models.message.userId];
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
        context.models.messages[id] = message;
        context.models.users[context.me.id].messageIds.push(id);
  
        return message;
      },
  
  
      /*
      
      The resolver finds the message by id from the object of messages by using a destructuring. If there is no message, the resolver returns false. If there is a message, the remaining messages without the deleted message are the updated version of the messages object. Then the resolver returns true. Otherwise, if no message is found, the resolver returns false. 
  
      */
  
      deleteMessage: (parent, { id }, { models }) => {
        const { [id]: message, ...otherMessages } = models.messages;
  
        if (!message) {
          return false;
        }
  
        models.messages = otherMessages;
  
        return true;
      },
  
      updateMessage: (parent, { id, text }, { models }) => {
        
        let message = Object.values(models.messages).filter(
          message => message.id === id,
        );
  
        console.log(message.length)
  
  
        if (message.length === 0) {
          return false;
        } else {
          models.messages[id].text = text;
        }

        return true;
      },

    },
  
};