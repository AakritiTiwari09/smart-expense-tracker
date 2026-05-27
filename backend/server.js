const http = require("http");
const db = require("./db");

const PORT = 5000;

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // ADD EXPENSE
    if (req.method === "POST" && req.url === "/add-expense") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", async () => {

        try {

            const expense = JSON.parse(body);

           const result = await db.query(
                
                `INSERT INTO expenses
                (category, amount, description, expense_date)
                VALUES (?, ?, ?, ?)`,
                [
                    expense.category,
                    expense.amount,
                    expense.description,
                    expense.expense_date
                ]
                
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Expense Added Successfully"
            }));

        } catch (err) {

            console.log(err);

            res.writeHead(500);
            res.end(JSON.stringify({
                error: err.message
            }));
        }
    });

    return;
}
if (req.method === "DELETE" && req.url.startsWith("/expense/")) {

    const id = req.url.split("/")[2];

    db.query(
        "DELETE FROM expenses WHERE id = ?",
        [id]
    )
    .then(() => {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Expense Deleted"
        }));

    })
    .catch((err) => {

        res.writeHead(500);

        res.end(JSON.stringify({
            error: err.message
        }));

    });

    return;
}
    // GET EXPENSES
   if (req.method === "GET" && req.url === "/expenses") {

    db.query(
        "SELECT * FROM expenses ORDER BY expense_date DESC"
        
    )
    .then(([rows]) => {


        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(rows));

    })
    .catch((err) => {

        console.log(err);

        res.writeHead(500);

        res.end(JSON.stringify({
            error: err.message
        }));

    });

    return;
}
// DELETE EXPENSE

if (
  req.method === "DELETE" &&
  req.url.startsWith("/expense/")
) {

  const id =
    req.url.split("/")[2];

  db.query(
    "DELETE FROM expenses WHERE id = ?",
    [id]
  )

  .then(() => {

    res.writeHead(200, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Expense Deleted"
      })
    );

  })

  .catch((err) => {

    res.writeHead(500);

    res.end(
      JSON.stringify({
        error:
          err.message
      })
    );

  });

  return;
}
// UPDATE EXPENSE

if (
  req.method === "PUT" &&
  req.url.startsWith("/expense/")
) {

  const id =
    req.url.split("/")[2];

  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {

    try {

      const expense =
        JSON.parse(body);

      await db.query(
        `UPDATE expenses
         SET description = ?,
             amount = ?
         WHERE id = ?`,
        [
          expense.title,
          expense.amount,
          id
        ]
      );

      res.writeHead(200, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          message:
            "Expense Updated"
        })
      );

    } catch (err) {

      res.writeHead(500);

      res.end(
        JSON.stringify({
          error:
            err.message
        })
      );

    }

  });

  return;
}


    res.writeHead(404);
    res.end("Route Not Found");
});

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});