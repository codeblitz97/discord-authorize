import fs from "fs";
import path from "path";
import { MissingDependencyError } from "./errors/DependencyError";
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
  throw new MissingDependencyError(
    `Required dependencies are missing: ${missingDependencies.join(", ")}`
  );
}

const authFolderPath = path.join(__dirname, "auth");

try {
  if (!fs.existsSync(authFolderPath)) {
    throw new Error(
      "The authentication folder doesn't exist. Re-installing may fix the error."
    );
  }
} catch (error: any) {
  throw new Error(error.message);
}

export * from "./auth";
export * from "./util";
export * from "./global";
