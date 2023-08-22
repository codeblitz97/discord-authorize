const { DiscordAuthorization, Scopes } = require("../dist");
const auth = require("../auth.json");
const app = require("express")();
const cookieParser = require("cookie-parser");

const dA = new DiscordAuthorization({
  clientId: auth.client_id,
  clientSecret: auth.client_secret,
  redirectUri: auth.redirect_uri,
});

app.use(cookieParser());

app.get("/auth/login", (req, res) => {
  const url = dA.generateOauth2Link({
    scopes: [Scopes.Identity, Scopes.Email],
  });
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const resp = await dA.exchangeCodeForTokens(code);

  res.cookie("access_token", resp.accessToken);
  res.redirect("/");
});

app.get("/user/info", async (req, res) => {
  const accessToken = req.cookies.access_token;
  dA.setAccessToken(accessToken);

  res.json({
    userName: await dA.getUserInfo(),
  });
});

app.listen(3000);
