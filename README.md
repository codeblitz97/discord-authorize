# discord-authorize: Simplifying Discord Authentication with a Node Module

## Introduction

`discord-authorize` is a powerful Node.js module that streamlines the process of authenticating users with Discord through OAuth2. This document provides a comprehensive guide on how to install, set up, and effectively utilize this module for seamless Discord authentication.

## Installation

To get started, install the latest version of `discord-authorize` using npm:

```sh
npm install discord-authorize@latest
```

## Usage (JavaScript)

### Setup

Begin by importing the necessary components from the `discord-authorize` module and initializing a new instance of `DiscordAuthorization`.

```js
const { DiscordAuthorization, Scopes } = require("discord-authorize");

const discord = new DiscordAuthorization({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
});
```

### Generating Authorization Link

Generate an OAuth2 authorization link by calling the `generateOauth2Link()` method, which creates a URL for users to grant permissions. This function requires scope(s) and a unique state parameter.

```js
const scopes = [Scopes.Identity, Scopes.Email];
const state = "UNIQUE_STATE_IDENTIFIER";

const authorizationLink = discord.generateOauth2Link({ scopes: scopes }, state);
```

### Handling Tokens

Upon successful authorization, you'll receive a code through the redirect URI's query parameter. Exchange this code for access and refresh tokens using the `exchangeCodeForTokens()` method. Here's an example using Express.js:

```js
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const tokens = await discord.exchangeCodeForTokens(code);

  res.cookie("access_token", tokens.accessToken);
  res.cookie("refresh_token", tokens.refreshToken);
  res.redirect("/");
});
```

### Setting Tokens

Use the `setAccessToken()` and `setRefreshToken()` methods to set the access and refresh tokens for subsequent requests. Here's how you can do this:

```js
discord.setAccessToken(req.cookies.access_token);
discord.setRefreshToken(req.cookies.refresh_token);
```

### Authorized User's Information

Retrieve authorized user information through the `getMyInfo()` method, which returns a user object. Here's an example:

```js
const myInfo = await discord.getMyInfo();
console.log(myInfo);
```

### Authorized User's Connections

If you require information about a user's connections, remember to include the `Connections` scope while generating the OAuth2 link. Subsequently, utilize the `getMyConnections()` method to retrieve the connections.

```js
const myConnections = await discord.getMyConnections();

const connectionInfo = myConnections.map((connection) => ({
  name: connection.name,
  type: connection.type,
  verified: connection.verified,
}));
```

The `getMyConnections()` method provides the following data structure:

```ts
id: string;
name: string;
type: string;
friend_sync: boolean;
metadata_visibility: number;
show_activity: boolean;
two_way_link: boolean;
verified: boolean;
visibility: number;
```

### Joining a guild

This module is nothing without the `joinGuild()` method. To join a guild, you can use `joinGuild()` method. The method expects `GuildJoinOptions` which has:

```ts
guildId: snowflake;
userId: snowflake;
roles: snowflake[] | undefined;
```

This method requires a client (bot) in order to join a server.
Now let's see the an usage of it:

```js
const discord = new DiscordAuthorize({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "YOUR_REDIRECT_URI",
  clientToken: "YOUR_BOT_TOKEN",
});

const response = await discord.joinGuild({
  guildId: "1148367209371021341",
  userId: "1074981842886864891",
});

res.json(response);
```

### Get Authorized User's Guild and it's information

With the `getGuilds()` function, we can get the information about what guild we are in and the information about the guilds we are in. Let's see an example of using it in the code below:

```js
const guilds = await discord.getGuilds();

res.json(guilds);
```

Now how to count the guild? We can do this manually but `discord-authorize` module provides builtin utility function to do it.

```js
const { Utils } = require("discord-authorize");

const guilds = await discord.getGuilds();

res.json({
  totalGuilds: Utils.totalGuildCount(guilds),
});
```

### Refreshing Access Tokens

To manage token expiration, use the `refreshToken()` method. This function revokes the current access token and provides a new one, ensuring uninterrupted access. Here's how you can do it:

```js
const newAccessToken = await discord.refreshToken();
res.cookie("access_token", newAccessToken.access_token);
```

### Full code

If you want the full code visit [this](https://github.com/codeblitz97/discord-authorize/blob/main/test/index.js)

## Conclusion

`discord-authorize` simplifies Discord authentication in Node.js applications. By following this guide, you can effortlessly integrate Discord authentication, user information retrieval, and token management into your projects.
