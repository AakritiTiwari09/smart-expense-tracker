import {
  useState,
  useEffect
} from "react";

import { Link }
from "react-router-dom";

import { Pie } from "react-chartjs-2";

function Analytics({ expenses,currency }) {
  
  const [rates,
  setRates] =
  useState({

    INR:1

  });
  useEffect(() => {

  fetch(
    "https://open.er-api.com/v6/latest/INR"
  )

  .then(
    (res) => res.json()
  )

  .then(
    (data) => {

      setRates(
        data.rates
      );

    }
  )

  .catch(
    (err) => {

      console.log(err);

    }
  );

}, []);

  const currentMonth =
    new Date()
    .getMonth();

  const currentYear =
    new Date()
    .getFullYear();

  const currentMonthExpenses =
    expenses.filter(

      (item) =>

        item.month ===
        currentMonth

        &&

        item.year ===
        currentYear

    );

  const categoryTotals = {};

  currentMonthExpenses.forEach(
    (item) => {

    if (
      categoryTotals[item.category]
    ) {

      categoryTotals[item.category] +=
        Number(item.amount);

    }

    else {

      categoryTotals[item.category] =
        Number(item.amount);

    }

  });

  // CATEGORY VALUES
  const food =
    categoryTotals["🍔 Food"] || 0;

  const travel =
    categoryTotals["🚕 Travel"] || 0;

  const shopping =
    categoryTotals["🛒 Shopping"] || 0;

  // TOTAL
  const totalExpense =
    food +
    travel +
    shopping;

  // AI INSIGHTS
  let insight =
    "Expenses look balanced.";

  let suggestion =
    "Your spending habits are good.";

  if (
    food >
    totalExpense * 0.5
  ) {

    insight =
      "Food expenses are too high this month.";

    suggestion =
      "Try reducing food expenses by 15%.";

  }

  else if (
    shopping >
    totalExpense * 0.4
  ) {

    insight =
      "Shopping expenses increased significantly.";

    suggestion =
      "Reduce shopping expenses by 20%.";

  }

  else if (
    travel >
    totalExpense * 0.4
  ) {

    insight =
      "Travel expenses are high.";

    suggestion =
      "Plan trips carefully to save money.";

  }

  else if (
    totalExpense > 8000
  ) {

    insight =
      "Monthly spending is near budget limit.";

    suggestion =
      "Avoid unnecessary expenses this week.";

  }

  // PIE CHART DATA

  const labels =
    Object.keys(
      categoryTotals
    );

  const values =
    Object.values(
      categoryTotals
    );

  const colors = [

    "#ff6384",
    "#36a2eb",
    "#ffce56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
    "#8bc34a",
    "#e91e63",
    "#00bcd4",
    "#9c27b0"

  ];

  const data = {

    labels,

    datasets: [

      {

        data: values,

        backgroundColor:
          labels.map(
            (_, index) =>
              colors[
                index %
                colors.length
              ]
          ),

        borderWidth: 1

      }

    ]

  };

  return (

    <div className="page">

      <h1>
        Analytics
      </h1>

      <Link
        to="/"
        className="back-btn"
      >
        🏠 Dashboard
      </Link>

      <br />
      <br />

      {/* AI INSIGHTS */}

      <div

        style={{

          width:"95%",

          maxWidth:"1100px",

          margin:"20px auto",

          background:
document.body.classList.contains(
"dark"
)
?
"#1e1e1e"
:
"white",

          padding:"40px",

          borderRadius:"20px",

          boxShadow:
            "0 8px 20px rgba(0,0,0,0.1)"

        }}

      >

        <h2
          style={{
            fontSize:"38px"
          }}
        >
          AI Expense Insights ⭐
        </h2>

        <br />

        <p
          style={{
            fontSize:"22px"
          }}
        >
          {insight}
        </p>

        <br />

        <h3
          style={{
            fontSize:"28px"
          }}
        >
          AI Suggestion:
        </h3>

        <br />

        <p
          style={{
            fontSize:"22px"
          }}
        >
          {suggestion}
        </p>

      </div>

      <br />

      {/* CATEGORY CARDS */}

      <div className="cards">

        <div className="card">

          <h2>
            {
(food *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            🍔 Food
          </p>

        </div>

        <div className="card">

          <h2>
            {
(travel *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            🚕 Travel
          </p>

        </div>

        <div className="card">

          <h2>
            {
(shopping *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            🛒 Shopping
          </p>

        </div>

      </div>

      <br />

      {/* PIE CHART */}

      <div

        style={{

          width:"700px",

          maxWidth:"100%",

          margin:"30px auto"

        }}

      >

        <Pie data={data} />

      </div>

    </div>

  );

}

export default Analytics;