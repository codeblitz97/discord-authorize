import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { URLSearchParams } from "url";
import { OAuth2Options } from "../types";
import { Scopes, UserInfo, ConnectionType, Guild } from "../types";
import getType from "../util/getType";

/**
 * Represents an instance of Discord OAuth2 authorization flow.
 */
class DiscordAuthorization {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private baseURL = "https://discord.com/api/v10";
  private refreshToken: string | null = null;
  private clientToken: string | null = null;

  /**
   * Creates an instance of DiscordAuthorization.
   * @param {OAuth2Options} options - Options for OAuth2 authorization.
   */
  constructor(options: OAuth2Options) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.clientToken = options.clientToken ?? null;
  }

  /**
   * Makes a request to the Discord API.
   * @private
   * @param {string} method - HTTP method.
   * @param {string} endpoint - API endpoint.
   * @param {AxiosRequestConfig} options - Request configuration options.
   * @returns {Promise<AxiosResponse>} - Response from the API.
   * @throws {Error} - If the request fails.
   */
  private async request(
    method: string,
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${this.accessToken}`,
    };

    const requestOptions: AxiosRequestConfig = {
      ...options,
      method,
      url: `${this.baseURL}${endpoint}`,
      headers,
    };

    if (method === "GET" && options.params) {
      requestOptions.params = options.params;
    }

    try {
      const response = await axios.request(requestOptions);
      if (response.status == 200 || response.status == 300) {
        return response;
      } else if (response.status === 401) {
        throw new Error(`Access token must be valid.`);
      } else if (response.status === 429) {
        throw new Error(`Request limit reached. Try again later`);
      } else if (response.status === 500) {
        throw new Error(`Discord API Server Error`);
      } else if (response.status === 404) {
        throw new Error(`Invalid request.`);
      } else if (response.status === 403) {
        throw new Error("You are not authorized to perform this action.");
      } else {
        throw new Error(`Status ${response.status} is not handled yet.`);
      }
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Generates an OAuth2 authorization link for Discord.
   * @param {{ scopes: Scopes[] }} param0 - Authorization scopes array.
   * @param [state="1bac472"] - Authorization state
   * @returns {string} - OAuth2 authorization link.
   */
  public generateOauth2Link(
    { scopes }: { scopes: Scopes[] },
    state: string = "1bac472"
  ): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      state: state,
      scope: scopes.join(" "),
    });

    return `https://discord.com/oauth2/authorize?${params}`;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @param {string} code - Authorization code.
   * @returns {Promise<object>} - Tokens object containing access and refresh tokens.
   * @throws {Error} - If the exchange process fails.
   */
  public async exchangeCodeForTokens(code: string): Promise<object> {
    if (getType(code) !== "snowflake") {
      throw new TypeError(
        `Expected type of code to exchange to be 'snowflake' but got ${getType(
          code
        )}`
      );
    }
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
    });

    try {
      const response = await this.request("POST", "/oauth2/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: params.toString(),
      });

      return {
        accessToken: response?.data.access_token,
        refreshToken: response?.data.refresh_token,
      };
    } catch (error) {
      throw new Error("Failed to exchange code for tokens");
    }
  }

  /**
   * Sets the access token.
   * @param {string} token - The access token to set.
   */
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Sets the refresh token.
   * @param {string} token - The refresh token to set.
   */
  public setRevokeToken(token: string): void {
    this.refreshToken = token;
  }

  /**
   * Revokes the existinga ccess token
   */
  async revokeToken(): Promise<void> {
    if (!this.accessToken || !this.refreshToken) {
      throw new Error(
        "Access token and refresh token are required to revoke the token."
      );
    }

    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);
    params.append("token", this.accessToken);

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      await axios.post(
        "https://discord.com/api/oauth2/token/revoke",
        params.toString(),
        config
      );
      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      throw new Error("Failed to revoke token");
    }
  }

  /**
   * Retrieves information about the authorized user.
   * @returns {Promise<UserInfo>} - User information.
   * @throws {Error} - If fetching user information fails.
   */
  public async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await this.request("GET", "/users/@me");
      return response?.data;
    } catch (error) {
      throw new Error("Failed to fetch user information");
    }
  }

  /**
   * Retrieves connections of the authorized user.
   * @returns {Promise<ConnectionType>} - User connections information.
   * @throws {Error} - If fetching user connections fails.
   */
  public async getUserConnections(): Promise<ConnectionType[]> {
    try {
      const response = await this.request("GET", "/users/@me/connections");
      return response?.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getGuilds(): Promise<Guild[]> {
    try {
      const response = await this.request("GET", "/users/@me/guilds");
      return response?.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getApplication(): Promise<any> {
    try {
      const response = await this.request("GET", "/oauth2/applications/@me", {
        headers: { Authorization: `Bot ${this.clientToken}` },
      });
      return response?.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves the username of the authorized user.
   * @returns {Promise<string>} - User's username.
   * @throws {Error} - If fetching the username fails.
   */
  async username(): Promise<string> {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo.username;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export { DiscordAuthorization, Scopes };
