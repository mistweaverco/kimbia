import chalk from "chalk";
import { configparser, Task } from "./../configparser/";
import { spawn } from "child_process";

const PLATFORM =
  process.platform === "win32"
    ? "windows"
    : process.platform === "darwin"
      ? "mac"
      : "linux";

interface RunCommandResponse {
  code: number;
  data: string;
}

function filterTasks(tasknames: string[], tasks: Task[]): string[] {
  return tasknames.filter((taskname: string) => {
    const foundTask = tasks.find((task) => task.name === taskname);

    if (foundTask) {
      const isSupported = foundTask.commands.some((command) =>
        command.platforms.includes(PLATFORM),
      );

      if (isSupported) {
        return true; // Task found and supported
      } else {
        console.log(
          chalk.yellow(
            `🐆 Task "${taskname}" found, but not supported on platform "${PLATFORM}".`,
          ),
        );
        return false; // Task found, but not supported
      }
    } else {
      console.log(chalk.red(`🐆 Task not found: ${taskname}`));
      console.log(chalk.yellow("Available tasks:"));
      for (const task of tasks) {
        console.log(chalk.yellow(`- ${task.name}`));
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
      child = spawn(cmd, args);
    } catch (error: unknown) {
      reject({ code: 1, data: (error as Error).message });
    }
    let stdoutData = "";
    let stderrData = "";

    child?.stdout.on("data", (data) => {
      // buffer to string conversion
      const str = data.toString();
      process.stdout.write(str);
      stdoutData += str;
    });

    child?.stderr.on("data", (data) => {
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

const run = async (tasknames: string[]): Promise<void> => {
  const config = configparser.parse();
  const tasks = config.tasks;
  // Filter tasks that are available for the current platform
  tasknames = filterTasks(tasknames, tasks);
  for (const task of tasks) {
    if (tasknames.indexOf(task.name) !== -1) {
      for (const command of task.commands) {
        if (command.platforms.indexOf(PLATFORM) !== -1) {
          console.log(chalk.green(`🐆 Running task: ${task.name}`));
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
};

export const taskrunner = {
  run,
};
