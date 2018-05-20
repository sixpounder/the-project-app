class Log {
  constructor () {
    /* eslint-disable-next-line no-console */
    this.log = console.log.bind(console);
    /* eslint-disable-next-line no-console */
    this.info = console.info.bind(console);
    /* eslint-disable-next-line no-console */
    this.warn = console.warn.bind(console);
    /* eslint-disable-next-line no-console */
    this.error = console.error.bind(console);
  }
}

const LogMixin = {
  created () {
    this.$log = new Log();
  }
}

export { Log, LogMixin };