import chalk from 'chalk';

export default class Logger {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  info(...message: unknown[]) {
    const time = new Date().toISOString();

    console.log(
      `[${chalk.grey(time)} ${chalk.green('INFO')} ${this.type}]`,
      ...message
    );
  }

  error(...message: unknown[]) {
    const time = new Date().toISOString();

    console.log(
      `[${chalk.grey(time)} ${chalk.red('ERROR')} ${this.type}]`,
      ...message
    );
  }
}
