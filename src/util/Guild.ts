type Guilds = object;

/**
 * Returns the total guild count of a user.
 * @param guildArray - An array of guild objects.
 * @returns The total count of guilds.
 * @throws {TypeError} If the input is not an array of guild objects.
 */
const totalGuildCount = <G extends Guild>(guildArray: G[]): number => {
  if (!Array.isArray(guildArray)) {
    throw new TypeError(
      `Guild array must be an array of guild objects, but got ${typeof guildArray}`
    );
  }

  return guildArray.length + 1;
};

export { totalGuildCount };
