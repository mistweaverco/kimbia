import * as fs from "fs";
import path from "path";
import yaml from "js-yaml";
import chalk from "chalk";
import readline from "readline";

const CONFIG_FILENAME = "kimbia.yaml";

type Platform = "linux" | "windows" | "mac";

export interface Task {
  name: string;
  description: string;
  commands: {
    platforms: Platform[];
    parallel?: boolean;
    run: string[];
  }[];
}

export interface Config {
  tasks: Task[];
}

const init = (): void => {
  const file = path.join(process.cwd(), CONFIG_FILENAME);
  const configHeader = `# yaml-language-server: $schema=https://kimbia.mwco.app/schema.json\n---\n`;
  const config: Config = {
    tasks: [
      {
        name: "lint+test",
        description: "Lint the project",
        commands: [
          {
            platforms: ["linux", "windows", "mac"],
            parallel: true,
            run: [
              "echo 'Linting project...' && sleep 5 && echo 'Project linted!'",
              "echo 'Test project...' && sleep 10 && echo 'Project tested!'",
            ],
          },
        ],
      },
      {
        name: "build",
        description: "Build the project",
        commands: [
          {
            platforms: ["linux", "windows", "mac"],
            run: ["echo 'Building project...'", "echo 'Project built!'"],
          },
        ],
      },
      {
        name: "deploy",
        description: "Deploy the project",
        commands: [
          {
            platforms: ["linux", "windows", "mac"],
            run: ["echo 'Deploying project...'", "echo 'Project deployed!'"],
          },
        ],
      },
    ],
  };
  if (fs.existsSync(file)) {
    console.log(chalk.red(`🐆 Config file already exists: ${file}`));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      `Do you want to overwrite the file? (y/N) `,
      (answer: string) => {
        if (answer.toLowerCase() === "y") {
          fs.writeFileSync(file, configHeader + yaml.dump(config));
          console.log(chalk.green(`🐆 Config file written: ${file}`));
        } else if (answer.toLowerCase() === "n") {
          console.log(chalk.yellow("🐆 Exiting..."));
        } else {
          console.log(chalk.red("🐆 Invalid input"));
        }
        rl.close();
      },
    );
  } else {
    fs.writeFileSync(file, configHeader + yaml.dump(config));
    console.log(chalk.green(`🐆 Config file written: ${file}`));
  }
};

const parse = (): Config => {
  const file = path.join(process.cwd(), CONFIG_FILENAME);
  if (!fs.existsSync(file)) {
    console.log(chalk.red(`🐆 Config file not found: ${file}`));
    process.exit(1);
  }
  const content = fs.readFileSync(file, "utf8");
  return yaml.load(content) as Config;
};

export const configparser = {
  init,
  parse,
};
