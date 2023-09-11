const EPOCH = 1420070400000n;

function generate({ exact = true, global = true, multiline = true } = {}) {
  const distance = BigInt(Date.now()) - EPOCH;
  const snowflake = (distance << 22n) | (1n << 17n) | (1n << 12n);
  const min = 17;
  const max = snowflake.toString().length;
  let regex = `\\d{${min},${max}}`;
  let flags = "";
  if (exact) regex = `^${regex}$`;
  if (global) flags += "g";
  if (multiline) flags += "m";
  return new RegExp(regex, flags);
}

const snowflakeRegex = generate();

declare global {
  interface Array<T> {
    isSnowflakeArray(): boolean;
    isStringArray(): boolean;
    isNumberArray(): boolean;
    isBooleanArray(): boolean;
  }
}

class ExtendedArray<T> extends Array<T> {
  isSnowflakeArray(): boolean {
    return this.every((item) => isSnowflake(item));
  }

  isNumberArray(): boolean {
    return this.every((item) => isNumber(item));
  }

  isStringArray(): boolean {
    return this.every((item) => isString(item));
  }
  isBooleanArray(): boolean {
    return this.every((item) => isBoolean(item));
  }
}

function isSnowflake<T>(value: T): boolean {
  return snowflakeRegex.test(value as string);
}

function isString<T>(value: T): boolean {
  return typeof value === "string";
}

function isNumber<T>(value: T): boolean {
  return typeof value === "number";
}

function isBoolean<T>(value: T): boolean {
  return typeof value === "boolean";
}

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
  | "numberArray"
  | "stringArray"
  | "snowflakeArray"
  | "booleanArray"
  | "snowflake"
  | "array"
  | "string"
  | "null"
  | "unknown" => {
  if (Number.isNaN(identifier)) {
    return "number"; // NaN is considered a "number" type
  } else if (identifier === null) {
    return "null";
  } else if (Array.isArray(identifier)) {
    const arr = new ExtendedArray();
    arr.push(...identifier);

    if (arr.isStringArray()) {
      return "stringArray";
    } else if (arr.isNumberArray()) {
      return "numberArray";
    } else if (arr.isSnowflakeArray()) {
      return "snowflakeArray";
    } else if (arr.isBooleanArray()) {
      return "booleanArray";
    } else {
      return "array";
    }
  } else if (isSnowflake(identifier)) {
    return "snowflake";
  } else if (typeof identifier === "string") {
    return "string";
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
