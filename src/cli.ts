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
  .command("run")
  .description("run tasks")
  .argument("[tasknames...]", "tasks to run")
  .action(async (files) => {
    if (files.length === 0) {
      taskrunner.list();
    } else {
      await taskrunner.run(files);
    }
  });

program
  .command("init")
  .description("initialize a new kimbia.yaml file")
  .action(() => {
    configparser.init();
  });

program.parse();
