export default {
  // Disable ESLINT undef rule for the next line since process.env is injected by webpack
  /* eslint-disable-next-line no-undef */
  apiHost: process.env.NODE_ENV === 'production' ? 'https://api.nowstream.it' : 'http://api.nsdevserver.local:3000'
};
