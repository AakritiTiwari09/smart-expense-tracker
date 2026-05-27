const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "expense-tracker-db.cxya2ukai2hw.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Aakriti2909"
});

connection.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Connected to AWS RDS");

  connection.query(
    "CREATE DATABASE IF NOT EXISTS expense_tracker",
    (err) => {
      if (err) throw err;

      console.log("Database created successfully");
      connection.end();
    }
  );
});