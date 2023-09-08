import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  RateLimitedError,
  InvalidAccessTokenError,
  DiscordAPIError,
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

  const errorMessages: Record<number, string> = {
    200: "Success",
    300: "Multiple Choices",
    400: "Bad request",
    401: "Access token must be valid.",
    429: "Request limit reached. Try again later.",
    500: "Discord API Server Error",
    404: "Not found.",
    403: "You are not authorized to perform this action.",
  };

  try {
    const response = await axios.request(requestOptions);

    return response;
  } catch (error: any) {
    const errorMessage =
      errorMessages[error?.response.status] ||
      `Status ${error?.response.status} is not handled yet.`;

    if (error?.response.data && error?.response.data.message) {
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
    } else {
      throw new Error(errorMessage);
    }
  }
}

export default request;
