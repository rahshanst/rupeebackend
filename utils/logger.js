const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const transport = new DailyRotateFile({
  filename: 'Logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss A'
    }),
    winston.format.json()
  ),
  // defaultMeta: { service: 'arguments.callee.name' },
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'Logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'Logs/combined.log' }),
    transport
  ],
});

module.exports = logger;
