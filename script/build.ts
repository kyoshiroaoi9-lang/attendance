import { execSync } from "node:child_process";

const run = (command: string) => {
  execSync(command, { stdio: "inherit" });
};

run("vite build");
