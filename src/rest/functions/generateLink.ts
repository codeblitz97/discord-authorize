import { Scopes } from "../../types";
import getType from "../../util/getType";

function generateLink(
  { scopes }: { scopes: Scopes[] },
  state: string,
  clientId: string,
  redirectUri: string
) {
  if (getType(state) !== "string") {
    throw new TypeError(
      `Expected type of state to be a 'string' but got ${getType(
        state
      )} instead.`
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state: state,
    scope: scopes.join(" "),
  });

  return `https://discord.com/oauth2/authorize?${params}`;
}

export { generateLink };
