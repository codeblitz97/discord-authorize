const getType = <T>(
  identifier: T
):
  | number
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "array"
  | "snowflake"
  | null
  | "unknown" => {
  if (Number.isNaN(identifier)) {
    return NaN;
  } else if (identifier === null) {
    return null;
  } else if (Array.isArray(identifier)) {
    return "array";
  } else if (typeof identifier === "string") {
    return "snowflake";
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
