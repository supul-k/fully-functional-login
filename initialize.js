const mysql = require("mysql");
const userModel = require("./repository/UserRepo");
const dbConfig = require("./config/dbConfig");
const environmentalVariables = require("dotenv").config();

const generateSuperAdminUser = () => {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((error) => {
    if (error) {
      console.error("Failed to connect to the database:", error);
      return;
    }
    userModel
      .createAdminUser(
        process.env.ADMIN_NAME,
        process.env.ADMIN_DOB,
        process.env.ADMIN_PHONE,
        process.env.ADMIN_EMAIL,
        process.env.ADMIN_PASSWORD,
        process.env.ADMIN_TYPE
      )
      .then(() => {
        console.log("Super admin user created successfully");
        connection.end();
      })
      .catch((error) => {
        console.error("Failed to create super admin user:", error);
        connection.end();
      });
  });
};

generateSuperAdminUser();
