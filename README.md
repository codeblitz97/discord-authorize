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

const authorizationLink = discord.generateOauth2Link(scopes, state);
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

### User Information

Retrieve authorized user information through the `getUserInfo()` method, which returns a user object. Here's an example:

```js
const userInfo = await discord.getUserInfo();
console.log(userInfo);
```

### User Connections

If you require information about a user's connections, remember to include the `Connections` scope while generating the OAuth2 link. Subsequently, utilize the `getUserConnections()` method to retrieve the connections.

```js
const userConnections = await discord.getUserConnections();

const connectionInfo = userConnections.map((connection) => ({
  name: connection.name,
  type: connection.type,
  verified: connection.verified,
}));
```

The `getUserConnections()` method provides the following data structure:

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

### Revoking Access Tokens

To manage token expiration, use the `revokeToken()` method. This function revokes the current access token and provides a new one, ensuring uninterrupted access. Here's how you can do it:

```js
const newAccessToken = await discord.revokeToken();
res.cookie("access_token", newAccessToken.access_token);
```

### Full code

If you want the full code visit [this](https://github.com/codeblitz97/discord-authorize/blob/main/test/index.js)

## Conclusion

`discord-authorize` simplifies Discord authentication in Node.js applications. By following this guide, you can effortlessly integrate Discord authentication, user information retrieval, and token management into your projects.
