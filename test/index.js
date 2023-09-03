const { DiscordAuthorization, Scopes, Utils } = require("../dist");
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
  clientToken: auth.token,
});

app.use(cookieParser());

app.get("/auth/login", async (req, res) => {
  const url = dA.generateOauth2Link(
    {
      scopes: [
        Scopes.Identity,
        Scopes.Email,
        Scopes.Connections,
        Scopes.Guilds,
        Scopes.GuildsMembersRead,
        Scopes.GuildsJoin,
      ],
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

    const userConnections = await dA.getMyConnections();

    const connectionNames = userConnections.map((connection) => ({
      name: connection.name,
      type: connection.type,
      verified: connection.verified,
    }));

    const userInfo = await dA.getMyInfo();
    const guilds = await dA.getGuilds();
    const applicationInfo = await dA.getApplication();

    res.json({
      globalName: userInfo.global_name,
      userName: userInfo.username,
      email: userInfo.email,
      connections: connectionNames,
      applicationInfo: applicationInfo,
      guilds:
        guilds.map((g) => ({
          name: g.name,
          id: g.id,
          icons: {
            png: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`,
            jpg: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg`,
            webp: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp`,
            gif: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.gif`,
          },
        })) || [],
      totalGuilds: Utils.totalGuildCount(guilds),
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/join-guild", async (req, res) => {
  try {
    const gId = req.query.guildId;
    const uId = req.query.userId;

    dA.setAccessToken(req.cookies.access_token);

    const data = await dA.joinGuild({
      guildId: gId,
      userId: uId,
    });

    return res.json({
      message: "Joined guild successfully.",
      apiResponse: data,
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000);
