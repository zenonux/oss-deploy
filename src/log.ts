import chalk from "chalk";
export default {
  warn: (str: string): void => {
    console.log(chalk.keyword("orange")(str));
  },
  error: (str: string): void => {
    console.log(chalk.red(str));
  },
  info: (str: string): void => {
    console.log(chalk.blue(str));
  },
  success: (str: string): void => {
    console.log(chalk.green(str));
  },
};
