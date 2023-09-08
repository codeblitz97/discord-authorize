import request from "../requestHandler";

async function getGuilds(accessToken: string) {
  const response = await request("GET", "/users/@me/guilds", accessToken);
  return response?.data;
}

export { getGuilds };
