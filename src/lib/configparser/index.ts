import * as fs from "fs";
import path from "path";
import yaml from "js-yaml";

const CONFIG_FILENAME = "kimbia.yaml";

type Platform = "linux" | "windows" | "mac";

interface Task {
  name: string;
  description: string;
  commands: {
    platforms: Platform[];
    run: string[];
  }[];
}

interface Config {
  tasks: Task[];
}

const parse = (): Config => {
  const file = path.join(process.cwd(), CONFIG_FILENAME);
  if (!fs.existsSync(file)) {
    throw new Error(`Config file not found: ${file}`);
  }
  const content = fs.readFileSync(file, "utf8");
  return yaml.load(content) as Config;
};

export const configparser = {
  parse,
};
