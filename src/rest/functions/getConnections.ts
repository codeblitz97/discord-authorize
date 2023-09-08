import request from "../requestHandler";

async function getConnections(accessToken: string) {
  const response = await request("GET", "/users/@me/connections", accessToken);
  return response?.data;
}

export { getConnections };
