const config = {
  user: "ticketAdmin",
  password: "LfFJMH0EFeHc6hKHcEMP",
  server: "ticket-booking.database.windows.net",
  database: "ruppee_db",
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    encrypt: true,
    instancename: "SQLEXPRESS",
    useUTC: false,
    dateFirst: 1,
  },
  port: 1433,
};

// user: process.env.DB_USER,
// password: process.env.DB_PASSWORD,
// server: process.env.DB_SERVER,
// database: process.env.DB_DATABASE,

module.exports = config;
