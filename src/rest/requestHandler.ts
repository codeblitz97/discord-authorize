import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  RateLimitedError,
  InvalidAccessTokenError,
  DiscordAPIError,
  errorMessages,
  statusCodedErrorMessages,
} from "../errors";
import getType from "../util/getType";

let baseURL = "https://discord.com/api/v10";
/**
 * Makes a request to the Discord API.
 * @private
 * @param {string} method - HTTP method.
 * @param {string} endpoint - API endpoint.
 * @param {AxiosRequestConfig} options - Request configuration options.
 * @returns {Promise<AxiosResponse>} - Response from the API.
 * @throws {Error} - If the request fails.
 */
async function request(
  method: string,
  endpoint: string,
  accessToken: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> {
  if (getType(accessToken) !== "string") {
    const censoredAccessToken = accessToken.substring(0, 5) + "...";
    throw new InvalidAccessTokenError(
      `The access token: ${censoredAccessToken} is invalid`
    );
  }
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  };

  const requestOptions: AxiosRequestConfig = {
    ...options,
    method,
    url: `${baseURL}${endpoint}`,
    headers,
  };

  if (method === "GET" && options.params) {
    requestOptions.params = options.params;
  } else if (["PUT", "POST", "PATCH"].includes(method)) {
    // For PUT, POST, and PATCH methods, pass the request data
    requestOptions.data = options.data;
  }

  try {
    const response = await axios.request(requestOptions);

    return response;
  } catch (error: any) {
    const errorMessage =
      errorMessages[error?.response.status] ||
      `Status ${error?.response.status} is not handled yet.`;

    const sEM = statusCodedErrorMessages[error?.response.data.code];

    if (
      error?.response.data &&
      error?.response.data.message &&
      error?.response.data.code === 0
    ) {
      switch (error?.response.status) {
        case 401:
          throw new InvalidAccessTokenError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );
        case 404:
          throw new NotFoundError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );
        case 400:
          throw new BadRequestError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );
        case 429:
          throw new RateLimitedError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );
        case 500:
          throw new DiscordAPIError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );
        case 403:
          throw new UnauthorizedError(
            `${errorMessage}`,
            JSON.stringify(error?.response.data)
          );

        default:
          throw new Error(
            `${errorMessage} Response Data: ${JSON.stringify(
              error?.response.data
            )}`
          );
      }
    } else if (
      error?.response.data &&
      error?.response.data.message &&
      error?.response.data.code !== 0
    ) {
      throw new DiscordAPIError(sEM, error?.response.data);
    } else {
      throw new Error(errorMessage);
    }
  }
}

export default request;
