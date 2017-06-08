var isDev = process.env.NODE_ENV === 'dev';

module.exports = {
  isDev:       isDev,
  ports:       isDev ? ['3000'] : ['10007'],
  secret:      '*',
  testCode:    '',
  allowOrigin: 'http://127.0.0.1:8080',
  yunpian:     '',
  db:          'mongodb://127.0.0.1:27017/shareading',
  testdb:      'mongodb://127.0.0.1:27017/shareading-test',
  sessiondb:   'mongodb://127.0.0.1:27017/shareading-session',
  cookie:      {
    domain: 'http://127.0.0.1',
    path:   '/',
    maxAge: 15552000000, // 6 * 30 days
    signed: true
  },
  log: {
    appenders: [{
      layout: {
        type: "pattern",
        pattern: "%[%d %-5p %-6c(%x{pid})%] - %m",
        tokens: {
          pid: process.pid
        }
      },
      type: "console"
    }, {
      layout: {
        type: "pattern",
        pattern: "%d %-5p (%x{pid}) - %m",
        tokens: {
          pid: process.pid
        }
      },
      type: "file",
      filename: "log/debug.log",
      category: "debug"
    }, {
      layout: {
        type: "pattern",
        pattern: "%d %-5p (%x{pid}) - %m",
        tokens: {
          pid: process.pid
        }
      },
      type: "dateFile",
      filename: "log/access",
      category: "access",
      pattern: "_yyyy-MM-dd.log",
      alwaysIncludePattern: true
    }]
  }
}
