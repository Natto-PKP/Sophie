import { Params } from 'src/structures/typings';

export = {
  listener: ({ sucrose }: Params<'ready'>) => {
    // console.log(`${sucrose.guilds.cache.size} guilds`);
    //! Remove all commands
    // sucrose.guilds.cache.forEach((guild) => {
    //   guild.commands.set([]);
    // });
    // sucrose.application?.commands.set([]);
  },
};
