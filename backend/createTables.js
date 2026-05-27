const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "expense-tracker-db.cxya2ukai2hw.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Aakriti2909",
  database: "expense_tracker",
});

connection.connect();

connection.query(`
CREATE TABLE IF NOT EXISTS expenses (
 id INT AUTO_INCREMENT PRIMARY KEY,
 category VARCHAR(100),
 amount DECIMAL(10,2),
 description TEXT,
 expense_date DATE
)
`);

connection.query(`
CREATE TABLE IF NOT EXISTS budgets (
 id INT AUTO_INCREMENT PRIMARY KEY,
 amount DECIMAL(10,2),
 month VARCHAR(20)
)
`);

console.log("Tables created!");
connection.end();