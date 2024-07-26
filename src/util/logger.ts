import chalk from 'chalk';

export default class Logger {
  info(...message: unknown[]) {
    const time = new Date().toISOString();

    console.log(`[${time} ${chalk.green('INFO')}]`, ...message);
  }
}
