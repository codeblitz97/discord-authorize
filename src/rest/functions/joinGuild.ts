import { GuildJoinOptions } from "../../types";
import request from "../requestHandler";
import getType from "../../util/getType";

async function joinGuild(
  options: GuildJoinOptions,
  clientToken: string,
  accessToken: string
) {
  const endpoint = `/guilds/${options.guildId}/members/${options.userId}`;
  const rolesToAdd = options.roles ?? [];

  const response = await request("PUT", `${endpoint}`, accessToken, {
    data: { roles: rolesToAdd, access_token: accessToken },
    headers: {
      Authorization: `Bot ${clientToken}`,
      "Content-Type": "application/json",
    },
  });

  return response?.data;
}

export { joinGuild };
