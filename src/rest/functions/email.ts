import { getInfo } from "./getInfo";

async function email(accessToken: string) {
  const userInfo = await getInfo(accessToken);
  return userInfo.email;
}

export { email };
