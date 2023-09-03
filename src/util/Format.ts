import { snowflake } from "../global";
import { Image } from "../types";
import getType from "./getType";

/**
 * Format a user's avatar image URLs in various formats.
 *
 * @template I - The type of the imageString parameter.
 * @param {snowflake} userId - The user's unique identifier (snowflake).
 * @param {I} imageString - The image string used to create the avatar URLs.
 * @returns {Image} An object containing URLs in different image formats (jpg, png, webp, gif).
 * @throws {TypeError} If the userId's type is not 'snowflake'.
 */
const formatUserAvatar = <I extends string>(
  userId: snowflake,
  imageString: I
): Image => {
  if (getType(userId) !== "snowflake") {
    throw new TypeError(
      `Expected type of user id to be 'snowflake' but got ${getType(
        userId
      )} instead.`
    );
  }

  const formattedJPG = `https://cdn.discordapp.com/avatars/${userId}/${imageString}.jpg`;
  const formattedPNG = `https://cdn.discordapp.com/avatars/${userId}/${imageString}.png`;
  const formattedWEBP = `https://cdn.discordapp.com/avatars/${userId}/${imageString}.webp`;
  const formattedGIF = `https://cdn.discordapp.com/avatars/${userId}/${imageString}.gif`;

  return {
    jpg: formattedJPG,
    png: formattedPNG,
    webp: formattedWEBP,
    gif: formattedGIF,
  };
};

const formatServerIcon = <I extends string>(
  guildId: snowflake,
  imageString: I
): Image => {
  if (getType(guildId) !== "snowflake") {
    throw new TypeError(
      `Expected type of user id to be 'snowflake' but got ${getType(
        guildId
      )} instead.`
    );
  }

  const formattedJPG = `https://cdn.discordapp.com/icons/${guildId}/${imageString}.jpg`;
  const formattedPNG = `https://cdn.discordapp.com/icons/${guildId}/${imageString}.png`;
  const formattedWEBP = `https://cdn.discordapp.com/icons/${guildId}/${imageString}.webp`;
  const formattedGIF = `https://cdn.discordapp.com/icons/${guildId}/${imageString}.gif`;

  return {
    jpg: formattedJPG,
    png: formattedPNG,
    webp: formattedWEBP,
    gif: formattedGIF,
  };
};

export { formatUserAvatar, formatServerIcon };
