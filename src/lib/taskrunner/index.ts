import chalk from "chalk";
import stripAnsi from "strip-ansi";
import terminalSize from "terminal-size";
import dotenv from "dotenv";
import { configparser, Task, TaskEnv } from "./../configparser/";
import { execSync, spawn } from "child_process";
import markdownit from "markdown-it";
import cliHtml from "@mistweaverco/cli-html";
const md = markdownit();

dotenv.config();

const PLATFORM =
  process.platform === "win32"
    ? "windows"
    : process.platform === "darwin"
      ? "mac"
      : "linux";

const ARCH =
  process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : "x86";

interface RunCommandResponse {
  code: number;
  data: string;
}

function filterTasks(
  tasknames: string[],
  tasks: Task[],
  quiet: boolean = false,
): string[] {
  return tasknames.filter((taskname: string) => {
    const foundTask = tasks.find((task) => task.name === taskname);
    if (foundTask) {
      const isSupported = foundTask.commands.some(
        (command) =>
          command.platforms.includes(PLATFORM) &&
          (command.arch === undefined ||
            command.arch.includes("all") ||
            command.arch.includes(ARCH)),
      );

      if (isSupported) {
        return true; // Task found and supported
      } else {
        if (!quiet) {
          console.log(
            chalk.yellow(
              `🐆 Task "${taskname}" found, but not supported on platform "${PLATFORM} @ ${ARCH}".`,
            ),
          );
        }
        return false; // Task found, but not supported
      }
    } else {
      if (!quiet) {
        console.log(chalk.red(`🐆 Task not found: ${taskname}`));
        console.log(chalk.yellow("Available tasks:"));
        for (const task of tasks) {
          const isSupported = task.commands.some((command) =>
            command.platforms.includes(PLATFORM),
          );
          if (isSupported) {
            console.log(chalk.yellow(`- ${task.name}`));
          }
        }
      }
      process.exit(1);
    }
  });
}

function extendEnv(env?: TaskEnv[]): { [key: string]: string } {
  const extenedEnv: { [key: string]: string } = {};
  if (!env) {
    return extenedEnv;
  }
  for (const e of env) {
    try {
      let ex;
      if (PLATFORM !== "windows") {
        ex = execSync(`export ${e.key}=${e.value} && echo $${e.key}`);
      } else {
        ex = execSync(`set ${e.key}=${e.value} && echo %${e.key}%`);
      }
      extenedEnv[e.key] = ex.toString().trim();
    } catch (error: unknown) {
      console.log(chalk.red((error as Error).message));
      extenedEnv[e.key] = e.value;
    }
  }
  return extenedEnv;
}

function runCommand(
  command: string,
  env?: TaskEnv[],
): Promise<RunCommandResponse> {
  const [cmd, ...args] = command.split(" ");
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(cmd, args, {
        shell: true,
        stdio: "inherit",
        env: { ...process.env, ...extendEnv(env) },
      });
    } catch (error: unknown) {
      reject({ code: 1, data: (error as Error).message });
    }
    let stdoutData = "";
    let stderrData = "";

    child?.stdout?.on("data", (data) => {
      // buffer to string conversion
      const str = data.toString();
      process.stdout.write(str);
      stdoutData += str;
    });

    child?.stderr?.on("data", (data) => {
      const str = data.toString();
      process.stderr.write(str);
      stderrData += str;
    });

    child?.on("close", (code) => {
      if (code === 0) {
        resolve({ code, data: stdoutData });
      } else {
        reject({ code, data: stderrData });
      }
    });

    child?.on("error", (err) => {
      reject({ code: 1, data: err.message });
    });
  });
}

const list = (): void => {
  const config = configparser.parse();
  const tasks = config.tasks;
  let tasknames = tasks.map((task) => task.name);
  tasknames = filterTasks(tasknames, tasks, true);
  console.log(chalk.green("🐆 Available tasks:"));
  for (const task of tasks) {
    if (tasknames.indexOf(task.name) !== -1) {
      console.log(chalk.green(`- ${task.name}`));
    }
  }
};

const run = async (tasknames: string[]): Promise<void> => {
  const config = configparser.parse();
  const tasks = config.tasks;
  // Filter tasks that are available for the current platform
  tasknames = filterTasks(tasknames, tasks);
  for (const task of tasks) {
    if (tasknames.indexOf(task.name) !== -1) {
      for (const command of task.commands) {
        if (
          command.platforms.indexOf(PLATFORM) !== -1 &&
          (command.arch === undefined ||
            command.arch.includes("all") ||
            command.arch.includes(ARCH))
        ) {
          console.log(chalk.green(`🐆 Running task: ${task.name}`));
          if (command.parallel) {
            const commands = command.run.map((c) => c.split(" "));
            const promises = commands.map((c) =>
              runCommand(c.join(" "), command.env),
            );
            try {
              await Promise.all(promises);
            } catch (error: unknown) {
              const err = error as RunCommandResponse;
              process.exit(err.code);
            }
          } else {
            for (const cmd of command.run) {
              console.log(chalk.blue(`🐆 Running command: ${cmd}`));
              try {
                await runCommand(cmd, command.env);
              } catch (error: unknown) {
                const err = error as RunCommandResponse;
                console.log(chalk.red(err.data));
                process.exit(err.code);
              }
            }
          }
        }
      }
    }
  }
};

enum OutputType {
  TEXT = "text",
  JSON = "json",
}

interface DescribeOptions {
  all?: boolean;
  fancy: boolean;
  output?: OutputType;
}

interface JsonOutput {
  name: string;
  description: string;
  commands: {
    platforms: string[];
    env: TaskEnv[];
    arch: string[];
    parallel: boolean;
    run: string[];
  }[];
}

function createBorder(
  content: string,
  borderColor = chalk.gray,
  backgroundColor = chalk.bgBlack,
) {
  const { columns: terminalWidth } = terminalSize();
  const lines = content.split("\n");

  const processedLines: string[] = [];
  lines.forEach((line) => {
    const strippedLine = stripAnsi(line);
    if (strippedLine.length > terminalWidth - 4) {
      for (let i = 0; i < strippedLine.length; i += terminalWidth - 4) {
        processedLines.push(line.substring(i, i + terminalWidth - 4));
      }
    } else {
      processedLines.push(line);
    }
  });

  const maxWidth =
    Math.max(...processedLines.map((line) => stripAnsi(line).length)) + 2;
  const topLeft = borderColor("╭");
  const topRight = borderColor("╮");
  const bottomLeft = borderColor("╰");
  const bottomRight = borderColor("╯");
  const horizontalLine = borderColor("─");
  const verticalLine = borderColor("│");

  const horizontalBorder =
    topLeft + horizontalLine.repeat(maxWidth + 1) + topRight;
  let borderedContent = horizontalBorder + "\n";

  processedLines.forEach((line) => {
    const padding = " ".repeat(maxWidth - stripAnsi(line).length);
    borderedContent +=
      verticalLine +
      backgroundColor(" " + line + padding) +
      verticalLine +
      "\n";
  });

  borderedContent +=
    bottomLeft + horizontalLine.repeat(maxWidth + 1) + bottomRight;

  return borderedContent;
}

const describe = (tasknames: string[], options: DescribeOptions): void => {
  const config = configparser.parse();
  const tasks = config.tasks;
  const output = options.output || OutputType.TEXT;
  const jsonOutput: JsonOutput[] = [];
  if (!options.all) {
    tasknames = filterTasks(tasknames, tasks, true);
  }
  for (const task of tasks) {
    if (tasknames.length === 0 || tasknames.indexOf(task.name) !== -1) {
      const jsonTask: JsonOutput = {
        name: "",
        description: "",
        commands: [],
      };
      switch (output) {
        case OutputType.TEXT:
          console.log(chalk.yellow(`🐆 Task: ${task.name}`));
          console.log(chalk.yellow("-".repeat(80)));
          if (!options.fancy) {
            console.log(task.description);
          } else {
            console.log(cliHtml(md.render(task.description)));
          }
          console.log(chalk.yellow("-".repeat(80)));
          break;
        case OutputType.JSON:
          jsonTask.name = task.name;
          jsonTask.description = task.description;
          jsonTask.commands = [];
          break;
      }
      for (const command of task.commands) {
        if (
          (!options.all && command.platforms.indexOf(PLATFORM) === -1) ||
          (command.arch !== undefined &&
            !command.arch.includes("all") &&
            !command.arch.includes(ARCH))
        ) {
          continue;
        }
        switch (output) {
          case OutputType.TEXT:
            console.log(chalk.cyan(`Command:`));
            console.log(`  Platforms: ${command.platforms.join(", ")}`);
            if (command.arch) {
              console.log(
                chalk.redBright(`  Arch: ${command.arch.join(", ")}`),
              );
            }
            if (command.parallel) {
              console.log(
                chalk.redBright(`      Parallel: ${command.parallel}`),
              );
            }
            for (const cmd of command.run) {
              if (options.fancy) {
                console.log(createBorder(cmd.trim()));
              } else {
                console.log(cmd.trim());
              }
            }
            break;
          case OutputType.JSON:
            jsonTask.commands.push({
              platforms: command.platforms,
              arch: command.arch || [],
              parallel: command.parallel || false,
              run: command.run,
            });
            break;
        }
      }
      if (output === OutputType.JSON && jsonTask.commands.length > 0) {
        jsonOutput.push(jsonTask);
      }
      if (output === OutputType.TEXT) {
        console.log();
      }
    }
  }
  if (output === OutputType.JSON) {
    console.log(JSON.stringify(jsonOutput, null, 2));
  }
};

export const taskrunner = {
  describe,
  list,
  run,
};
