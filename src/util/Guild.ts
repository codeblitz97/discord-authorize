type Guilds = object;

/**
 * Returns the total guild count of a user
 * @param guildArray - The guild object-array
 * @returns Guilds count
 */
const totalGuildCount = <G extends Guilds>(guildArray: G[]): number => {
  if (typeof guildArray !== "object") {
    throw new TypeError(
      `Guild array must be an object-array got ${typeof guildArray}`
    );
  }

  return (guildArray.length + 1) as number;
};

export { totalGuildCount };
