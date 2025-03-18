import pkg from "./../package.json";
import { Command } from "commander";
import { taskrunner } from "./lib/taskrunner";
import { configparser } from "./lib/configparser";
const program = new Command();

program
  .name("kimbia")
  .description("A minimal cross-platform task runner.")
  .version(pkg.version);

program
  .command("list")
  .alias("ls")
  .description("list all available tasks")
  .action(() => {
    taskrunner.list();
  });

program
  .command("describe")
  .alias("show")
  .description("describe tasks")
  .argument("[tasknames...]", "tasks to describe")
  .option(
    "-a, --all",
    "show all tasks, including those not available on this platform",
  )
  .option(
    "-o, --output [format]",
    "Output format, valid values are text or json.",
    "text",
  )
  .option(
    "--no-fancy",
    "Disable markdown rendering of task description and fancy command output.",
  )
  .action((tasks, options) => {
    if (tasks.length === 0) {
      taskrunner.listDescribe(options);
    } else {
      taskrunner.describe(tasks, options);
    }
  });

program
  .command("run")
  .description("run tasks")
  .argument("[tasknames...]", "tasks to run")
  .action(async (tasks) => {
    if (tasks.length === 0) {
      taskrunner.listRun();
    } else {
      await taskrunner.run(tasks);
    }
  });

program
  .command("init")
  .description("initialize a new kimbia.yaml file")
  .action(() => {
    configparser.init();
  });

program.parse();
