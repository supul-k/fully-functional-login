const mysql = require("mysql");
const dbConfig = require("./dbConfig");

const connection = mysql.createConnection(dbConfig);

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL database:", error);
    return;
  }

  console.log("Connected to MySQL database!");
});

module.exports = connection;
