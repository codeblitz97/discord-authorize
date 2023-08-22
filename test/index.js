const { DiscordAuthorization, Scopes } = require("../dist");
const auth = require("../auth.json");
const app = require("express")();
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

/**
 * Generates a hex string
 * @param {number} length - The length of the hex string
 * @returns {string} - The generated string
 */
function generateHex(length) {
  if (length % 2 !== 0) {
    throw new Error("Hex length must be an even number.");
  }

  const bytes = crypto.randomBytes(length / 2);
  return bytes.toString("hex");
}

const dA = new DiscordAuthorization({
  clientId: auth.client_id,
  clientSecret: auth.client_secret,
  redirectUri: auth.redirect_uri,
});

app.use(cookieParser());

app.get("/auth/login", async (req, res) => {
  const url = dA.generateOauth2Link(
    {
      scopes: [Scopes.Identity, Scopes.Email, Scopes.Connections],
    },
    generateHex(16)
  );
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const resp = await dA.exchangeCodeForTokens(code);

  res.cookie("access_token", resp.accessToken);
  res.cookie("refresh_token", resp.refreshToken);
  res.redirect("/");
});
app.get("/user/info", async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;
    dA.setAccessToken(accessToken);

    const userConnections = await dA.getUserConnections();

    const connectionNames = userConnections.map((connection) => ({
      name: connection.name,
      type: connection.type,
      verified: connection.verified,
    }));

    const userInfo = await dA.getUserInfo();

    res.json({
      globalName: userInfo.global_name,
      userName: userInfo.username,
      email: userInfo.email,
      connections: connectionNames,
    });
  } catch (error) {
    const revokeToken = req.cookies("refresh_token");
    dA.setRevokeToken(revokeToken);
    const newAccessToken = await dA.revokeToken();
    res.cookie("access_token", newAccessToken.access_token);
    res.redirect("/user/info");
  }
});

app.listen(3000);
