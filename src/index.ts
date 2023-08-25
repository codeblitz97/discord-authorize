import fs from "fs";
import path from "path";
import { exit } from "process";
const pkg = require("../package.json");

const requiredDependencies: string[] = Object.keys(pkg.dependencies);

const missingDependencies: string[] = requiredDependencies.filter((dep) => {
  try {
    require.resolve(dep);
    return false;
  } catch (err) {
    return true;
  }
});

if (missingDependencies.length > 0) {
  console.error(
    `Required dependencies are missing: ${missingDependencies.join(", ")}`
  );
  exit(1);
}

const authFolderPath = path.join(__dirname, "auth");

try {
  if (!fs.existsSync(authFolderPath)) {
    throw new Error(
      "The authentication folder doesn't exist. Re-installing may fix the error."
    );
  }
} catch (error: any) {
  console.error(error.message);
  exit(1);
}

export * from "./auth";
export * from "./util";
export * from "./global";
