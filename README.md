# discord-authorize

A node module for easy authentication with Discord

## Installing

```sh
npm install discord-authorize@latest
```

## Usage (JavaScript)

### Setup

```js
const { DiscordAuthorization, Scopes } = require("discord-authorize");

const discord = new DiscordAuthorization({
  clientId: "CLIENT ID HERE",
  clientSecret: "CLIENT SECRET HERE",
  redirectUri: "THE REDIRECT URI",
});
```

### Getting Authorization link

```js
const link = discord.generateOauth2Link(
  {
    scopes: [Scopes.Identity, Scopes.Email],
  },
  "statuidiuudgiuiuw"
); // here the generateOauth2Link gets two parameters, the first is for the scopes and second one is the state
```

### Handling the token

You have to handle the token from the redirect uri. The redirect uri should have the 'code' query parameter, you have to recieve the code and use `exchangeCodeForTokens()` method to exchange the code with access or refresh token.
Example (with expressjs):

```js
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code; // Recieving the code from the callback uri
  const tokens = await discord.exchangeCodeForTokens(code); // Exchanging the code with the access and refresh tokens

  res.cookie("access_token", tokens.accessToken); // Setting the accessToken to cookie
  res.cookie("refresh_token", tokens.refreshToken); // Setting the refreshToken to cookie
  res.redirect("/");
});
```

### Setting the tokens

To set the access token and refresh token you can use the `setAcessToken()` and `setRevokeToken()` methods.
Example:

```js
discord.setAccessToken(req.cookies("access_token")); // We are setting the access token from the cookie
discord.setRevokeToken(req.cookies("refresh_token"));
```

### User info

To recieve the authorized user information you can use the `getUserInfo()` method. It returns a [user](https://discord.com/developers/docs/resources/user#user-object) object

Example:

```js
const info = await discord.getUserInfo();
console.log(info);
```

### User connections

To get the connections of a user, you must add `Connections` scope to the `generateOauth2Link()` function and then you can use `getUserConnections()` method to get the connections.

```js
const userConnections = await discord.getUserConnections();

const connectionNames = userConnections.map((connection) => ({
  name: connection.name,
  type: connection.type,
  verified: connection.verified,
}));
```

The `getUserConnections()` method returns:

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

### Revoking the access token

In an hour, your access token will be expired and to not make the client authorize all time access token gets expired you can use the `revokeToken()` method.
Example:

```js
const newAccessToken = await discord.revokeToken();
res.cookie("access_token", newAccessToken.access_token);
```
