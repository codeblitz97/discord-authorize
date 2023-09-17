type snowflake = string;

function toSnowflake(input: string) {
  const parsed = parseFloat(input);
  if (Number.isNaN(parsed)) {
    throw new TypeError(`Invalid snowflake format: ${input}`);
  }

  const snowflake = BigInt(parsed);
  if (snowflake < 0 || snowflake > 9223372036854775807n) {
    throw new TypeError(`Snowflake out of range: ${input}`);
  }

  return snowflake.toString();
}

export { snowflake, toSnowflake };
