import { snowflake } from "../../global";
import getType from "../../util/getType";
import request from "../requestHandler";

async function getProfileInGuilds(guildId: snowflake, accessToken: string) {
  if (getType(guildId) !== "snowflake") {
    throw new TypeError(
      `guildId is not a valid snowflake.\nExpected: 'snowflake'\tReceived: ${getType(
        guildId
      )}`
    );
  }
  
  const response = await request(
    "GET",
    `/users/@me/guilds/${guildId}/member`,
    accessToken
  );
  return response?.data;
}

export { getProfileInGuilds };
