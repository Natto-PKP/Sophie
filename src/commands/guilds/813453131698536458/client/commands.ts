import { CommandOption } from 'src/structures/typings';

export = <CommandOption>{
  option: {
    name: 'commands',
    description: 'Gérez les commandes du client',
    type: 'SUB_COMMAND_GROUP',
  },
};
