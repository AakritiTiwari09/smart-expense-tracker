import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Budget({ expenses,currency }) {
  const [monthlyBudget, setMonthlyBudget] =
useState(
  Number(
    localStorage.getItem("monthlyBudget")
  ) || 10000
);
const saveBudget = () => {

  localStorage.setItem(
    "monthlyBudget",
    monthlyBudget
  );

  alert(
    "Budget Saved Successfully"
  );

};
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

const total =
  currentMonthExpenses.reduce(

    (sum, item) =>

      sum +
      Number(item.amount),

    0

  );

  const remaining =
    monthlyBudget - total;

  const usedPercentage =
    (total / monthlyBudget) * 100;

  return (

    <div
      className="page"

      style={{
        paddingTop:"100px"
      }}
    >

      <h1>
        Budget Planner
      </h1>
      <h3
  style={{
    textAlign:"center"
  }}
>

  {
    new Date()
    .toLocaleString(
      "default",
      {
        month:"long",
        year:"numeric"
      }
    )
  }

</h3>
      <Link
        to="/"
        className="back-btn"
      >
        🏠 Dashboard
      </Link>

      <br />
      <br />
      <br />
<br />

<div
  style={{
    textAlign:"center"
  }}
>

  <input
    type="number"
    placeholder="Enter Monthly Budget"

    value={monthlyBudget}

    onChange={(e) =>
      setMonthlyBudget(
        Number(e.target.value)
      )
    }

    style={{
      padding:"10px",
      width:"250px",
      marginRight:"10px"
    }}
  />

  <button
    onClick={saveBudget}
  >
    Save Budget
  </button>

</div>

<br />
      <div className="cards">

        {/* MONTHLY */}

        <div className="card">

          <h2>
            {
(
monthlyBudget *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            Monthly Budget
          </p>

        </div>

        {/* TOTAL */}

        <div className="card">

          <h2>
            {
(
total *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            Total Expense
          </p>

        </div>

        {/* REMAINING */}

        <div className="card">

          <h2>
            {
(
remaining *
(rates[currency] || 1)
).toFixed(2)
}
{" "}
{currency}
          </h2>

          <p>
            Remaining Budget
          </p>

        </div>

      </div>

      <br />

      {/* PROGRESS BAR */}

      <div
        style={{
          width:"80%",
          margin:"auto",
          background:"#ddd",
          borderRadius:"10px",
          overflow:"hidden",
          height:"25px"
        }}
      >

        <div

          style={{
            width:`${usedPercentage}%`,
            height:"100%",

            background:
              usedPercentage >= 80
              ? "red"
              : "green"
          }}

        />

      </div>

      <br />

      <h3
        style={{
          textAlign:"center"
        }}
      >
        {usedPercentage.toFixed(1)}%
        budget used
      </h3>

      {/* WARNING */}

      {
        usedPercentage >= 80 &&
        usedPercentage < 100 && (

          <div
            style={{
              display:"flex",
              justifyContent:"center",
              marginTop:"20px"
            }}
          >

            <div
              className="card"
              style={{
                width:"500px",
                textAlign:"center"
              }}
            >

              <h2
                style={{
                  color:"orange"
                }}
              >

                Warning:
                You crossed
                80% of budget 🚨

              </h2>

            </div>

          </div>

        )
      }

      {/* EXCEEDED */}

      {
        total > monthlyBudget && (

          <div
            style={{
              display:"flex",
              justifyContent:"center",
              marginTop:"20px"
            }}
          >

            <div
              className="card"
              style={{
                width:"500px",
                textAlign:"center"
              }}
            >

              <h2
                style={{
                  color:"red"
                }}
              >

                Budget Exceeded ❌

              </h2>

            </div>

          </div>

        )
      }

      {/* SAFE */}

      {
        total < monthlyBudget &&
        usedPercentage < 80 && (

          <div
            style={{
              display:"flex",
              justifyContent:"center",
              marginTop:"20px"
            }}
          >

            <div
              className="card"
              style={{
                width:"500px",
                textAlign:"center"
              }}
            >

              <h2
                style={{
                  color:"green"
                }}
              >

                Budget is Safe ✅

              </h2>

            </div>

          </div>

        )
      }

    </div>

  );
}

export default Budget;