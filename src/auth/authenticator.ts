import axios from "axios";
import { URLSearchParams } from "url";
import { OAuth2Options } from "../types";
import { Scopes, UserInfo } from "../types";

class DiscordAuthorization {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(options: OAuth2Options) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
  }

  public generateOauth2Link({ scopes }: { scopes: Scopes[] }): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
    });

    return `https://discord.com/oauth2/authorize?${params}`;
  }

  public async exchangeCodeForTokens(code: string): Promise<any> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
    });

    try {
      const response = await axios.post(
        "https://discord.com/api/oauth2/token",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return {
        accessToken: response?.data.access_token,
        refreshToken: response?.data.refresh_token,
      };
    } catch (error) {
      throw new Error("Failed to exchange code for tokens");
    }
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await axios.get(
        "https://discord.com/api/v10/users/@me",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Error("Failed to fetch user information");
    }
  }

  public async getUserConnections(): Promise<any> {
    try {
      const response = await axios.get(
        "https://discord.com/api/v10/users/@me/connections",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      throw new Error(`Failed to fetch user information with error: ${error}`);
    }
  }

  async username(): Promise<string> {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo.username;
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

export { DiscordAuthorization, Scopes };
