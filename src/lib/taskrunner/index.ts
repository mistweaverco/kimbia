import chalk from "chalk";
import util from "util";
import { configparser } from "./../configparser/";
import { exec } from "child_process";
const execAsync = util.promisify(exec);

const PLATFORM =
  process.platform === "win32"
    ? "windows"
    : process.platform === "darwin"
      ? "mac"
      : "linux";

const run = async (tasknames: string[]): Promise<void> => {
  const config = configparser.parse();
  const tasks = config.tasks;
  // Filter tasks that are available for the current platform
  tasknames = tasknames.filter((taskname) => {
    if (
      tasks.find(
        (task) =>
          task.name === taskname &&
          task.commands.find(
            (command) => command.platforms.indexOf(PLATFORM) !== -1,
          ),
      )
    ) {
      return true;
    } else {
      console.log(chalk.red(`Task not found: ${taskname}`));
      // print available tasks
      console.log(chalk.yellow("Available tasks:"));
      for (const task of tasks) {
        console.log(chalk.yellow(`- ${task.name}`));
      }
      process.exit(1);
    }
  });
  for (const task of tasks) {
    if (tasknames.indexOf(task.name) !== -1) {
      for (const command of task.commands) {
        if (command.platforms.indexOf(PLATFORM) !== -1) {
          console.log(chalk.green(`Running task: ${task.name}`));
          for (const cmd of command.run) {
            console.log(chalk.blue(`Running command: ${cmd}`));
            const { stdout, stderr } = await execAsync(cmd);
            if (stdout) {
              console.log(chalk.green(stdout));
            }
            if (stderr) {
              console.log(chalk.red(stderr));
              process.exit(1);
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
