import { snowflake } from "../../global";
import getType from "../../util/getType";
import request from "../requestHandler";

async function getTokens(
  code: string,
  clientId: snowflake,
  clientSecret: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string }> {
  if (getType(code) !== "string") {
    throw new TypeError(
      `Expected type of code to exchange to be 'string' but got ${getType(
        code
      )}`
    );
  }
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const response = await request("POST", "/oauth2/token", "", {
    data: params.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return {
    accessToken: response?.data.access_token,
    refreshToken: response?.data.refresh_token,
  };
}

export { getTokens };
