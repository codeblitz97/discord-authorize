import { snowflake } from "../global";

interface OAuth2Options {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  clientToken?: string | undefined;
}

interface GuildJoinOptions {
  guildId: snowflake;
  userId: snowflake;
  roles: snowflake[] | undefined;
}

export { OAuth2Options, GuildJoinOptions };
