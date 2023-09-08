import request from "../requestHandler";

async function getInfo(accessToken: string) {
  const response = await request("GET", "/users/@me", accessToken);

  return response?.data;
}

export { getInfo };
