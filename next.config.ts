import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

let buildVersion = "dev";
try {
  buildVersion = readFileSync(join(process.cwd(), ".build-version"), "utf-8").trim();
} catch {
  // .build-version not found, using "dev"
}

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    BUILD_VERSION: buildVersion,
  },
};

export default nextConfig;
