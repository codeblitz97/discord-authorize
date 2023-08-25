/**
 * Returns the type of a specific identifier.
 *
 * @example
 * ```ts
 * let a = "Hello!";
 * getType(a); // Returns: "string"
 * ```
 * Snowflake type:
 * @example
 * ```ts
 * let a = "1043709478031343647";
 * getType(a); // Returns: "snowflake"
 * ```
 * Learn more about snowflake types at: [Snowflakes Documentation](https://discord.com/developers/docs/reference#snowflakes)
 *
 * @template T - The type of the input identifier
 * @param {T} identifier - The type identifier
 * @returns {("number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array" | "snowflake" | "string" | "null" | "unknown")} The returned type
 */
const getType = <T>(
  identifier: T
):
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "array"
  | "snowflake"
  | "string"
  | "null"
  | "unknown" => {
  if (Number.isNaN(identifier)) {
    return "number"; // NaN is considered a "number" type
  } else if (identifier === null) {
    return "null";
  } else if (Array.isArray(identifier)) {
    return "array";
  } else if (typeof identifier === "string") {
    const snowflakeRegex = /^[0-9]{18}$/;
    if (snowflakeRegex.test(identifier)) {
      return "snowflake";
    } else {
      return "string";
    }
  } else if (typeof identifier === "bigint") {
    return "bigint";
  } else if (typeof identifier === "boolean") {
    return "boolean";
  } else if (typeof identifier === "function") {
    return "function";
  } else if (typeof identifier === "number") {
    return "number";
  } else if (typeof identifier === "object") {
    return "object";
  } else if (typeof identifier === "symbol") {
    return "symbol";
  } else if (typeof identifier === "undefined") {
    return "undefined";
  } else {
    return "unknown";
  }
};

export default getType;
