export default {
    Query: {
      
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        },

        user: (parent, args, { models }) => { 
            return models.users[args.id];
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
      },
  
      messages: (user, args, { models }) => {
        return Object.values(models.messages).filter(
          message => message.userId === user.id,
        );
      },
  
    },
  
};