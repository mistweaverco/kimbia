import pkg from "./../package.json";
import { Command } from "commander";
import { taskrunner } from "./lib/taskrunner";
const program = new Command();

program
  .name("kimbia")
  .description("A minimal cross-platform task runner.")
  .version(pkg.version);

program
  .command("run")
  .description("run tasks")
  .argument("<tasknames...>", "tasks to run")
  .action(async (files) => {
    await taskrunner.run(files);
  });

program.parse();
