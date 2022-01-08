# Sophie - Discord bot

This is multi-functions discord bot create by Natto-PKP

- [Typescript](https://www.typescriptlang.org/docs/)
- [Postgres](https://www.postgresql.org/docs/)
- [Sequelize](https://sequelize.org/master/)
- [Discord.js](https://discord.js.org/#/docs)

> Discord support server: https://discord.gg/uzwX5KtpW7

## # Table of contents

- [Bot structure](https://github.com/projects-setup/discord.js-setup)

# Sophie setup

## # Install all dependencies

```bash
$ npm install
$ yarn install
```

## # Create .env

```js
TOKEN = 'discord client token'; // Secret token
PROD = false; // Set true if this bot is in production

// Postgres logins
PGHOST = 'localhost';
PGUSER = 'username';
PGDATABASE = 'database';
PGPASSWORD = 'password';
PGPORT = 5432;
```

## # Start bot

> ### Developement
>
> ```bash
> $ npm start
> ```
>
> With automatically restart
>
> ```bash
> $ npm run dev
> ```

> ### Build
>
> ```bash
> $ npm run build
> ```

> ### Production
>
> This command run build before production start
>
> ```bash
> $ npm run start:prod
> ```
