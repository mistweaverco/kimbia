import chalk from "chalk";
import dotenv from "dotenv";
import { configparser, Task } from "./../configparser/";
import { spawn } from "child_process";

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

function runCommand(command: string) {
  const [cmd, ...args] = command.split(" ");
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(cmd, args, {
        shell: true,
        stdio: "inherit",
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
            const promises = commands.map((c) => runCommand(c.join(" ")));
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
                await runCommand(cmd);
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

interface DescribeOptions {
  all?: boolean;
}

const describe = (tasknames: string[], options: DescribeOptions): void => {
  const config = configparser.parse();
  const tasks = config.tasks;
  if (!options.all) {
    tasknames = filterTasks(tasknames, tasks, true);
  }
  for (const task of tasks) {
    if (tasknames.length === 0 || tasknames.indexOf(task.name) !== -1) {
      console.log(chalk.yellow(`🐆 Task: ${task.name}`));
      console.log(`   Description: ${task.description}`);
      for (const command of task.commands) {
        if (
          (!options.all && command.platforms.indexOf(PLATFORM) === -1) ||
          (command.arch !== undefined &&
            !command.arch.includes("all") &&
            !command.arch.includes(ARCH))
        ) {
          continue;
        }
        console.log(chalk.cyan(`   Command:`));
        console.log(`      Platforms: ${command.platforms.join(", ")}`);
        if (command.arch) {
          console.log(
            chalk.redBright(`      Arch: ${command.arch.join(", ")}`),
          );
        }
        if (command.parallel) {
          console.log(chalk.redBright(`      Parallel: ${command.parallel}`));
        }
        for (const cmd of command.run) {
          console.log(chalk.cyanBright(`        - ${cmd}`));
        }
      }
    }
    console.log();
  }
};

export const taskrunner = {
  describe,
  list,
  run,
};
