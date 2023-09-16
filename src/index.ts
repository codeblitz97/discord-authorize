import fs from "fs";
import path from "path";
import { MissingDependencyError } from "./errors/DependencyError";
const pkg = require("../package.json");

function compareVersions(versionA: string, versionB: string) {
  const partsA = versionA.split(".").map(Number);
  const partsB = versionB.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (partsA[i] < partsB[i]) return -1;
    if (partsA[i] > partsB[i]) return 1;
  }

  return 0;
}
const requiredVersion = "17.0.0";
const currentNodeVersion = process.versions.node;

if (compareVersions(currentNodeVersion, requiredVersion) < 0) {
  throw new Error(`Node.js version ${requiredVersion} or higher is required.`);
}

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
