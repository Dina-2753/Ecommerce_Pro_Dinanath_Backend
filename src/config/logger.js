const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    // Add other transports as needed (e.g., file transport)
  ],
});

module.exports = logger;
