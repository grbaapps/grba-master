var winston = require("winston")
var file_location = __dirname+"/../logs/app.log"
console.log("log level is : "+ process.env.debugLevel )
var tarnsportConfig = {
          colorize: true,
          timestamp: true,
          filename: file_location,
          maxsize: 1024*1024,
          maxfiles:3
      }
var logger = new (winston.Logger)({
  transports: [new (winston.transports.File)(tarnsportConfig)],
  level: process.env.debugLevel || 'warn' });
module.exports = logger;
