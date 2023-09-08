import { getInfo } from "./getInfo";

async function username(accessToken: string) {
  const userInfo = await getInfo(accessToken);
  return userInfo.username;
}

export { username };
