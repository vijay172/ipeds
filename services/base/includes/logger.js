var bunyan = require('bunyan'),
    bformat = require('bunyan-format'),
    formatOut = bformat({ outputMode: 'bunyan', levelInString: true });

var logger = bunyan.createLogger({
    name: 'logger',
    streams: [{
        stream: formatOut,
        level: (process.env.loggerLevel) || 'debug'
    }]
});

logger.on('error', function (err, stream) {
    // Handle stream write or create error here.
    console.error("Logger is broken", {component: 'logger', error: err, timestamp: new Date().toISOString()});
});

module.exports = logger;