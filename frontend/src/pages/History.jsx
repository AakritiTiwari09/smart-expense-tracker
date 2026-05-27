import React, {
  useState,
  useRef,
  useEffect
} from "react";

import {
  Link
} from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs }
from "file-saver";

function History({
  expenses,
  setExpenses,currency
}) {
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

  const pdfRef = useRef();

  const [search,
    setSearch] =
    useState("");

  const [filterCategory,
    setFilterCategory] =
    useState("");

  const [editIndex,
    setEditIndex] =
    useState(null);

  const [editTitle,
    setEditTitle] =
    useState("");

  const [editAmount,
    setEditAmount] =
    useState("");

  const filteredExpenses =
    expenses.filter((item) => {

      return (

        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        &&

        (
          filterCategory === ""

          ||

          item.category ===
          filterCategory
        )

      );

    });

  const currentMonth =
    new Date()
    .getMonth();

  const currentYear =
    new Date()
    .getFullYear();

  const previousExpenses =
    expenses.filter(

      (item) =>

        item.month !==
        currentMonth

        ||

        item.year !==
        currentYear

    );
    const groupedExpenses = {};

previousExpenses.forEach(
  (item) => {

    const monthYear =
      new Date(item.date)
      .toLocaleString(
        "default",
        {
          month: "long",
          year: "numeric"
        }
      );

    if (
      !groupedExpenses[
        monthYear
      ]
    ) {

      groupedExpenses[
        monthYear
      ] = [];

    }

    groupedExpenses[
      monthYear
    ].push(item);

  }
);


  const downloadPDF = () => {

    const input =
      pdfRef.current;

    html2canvas(input)
      .then((canvas) => {

        const imgData =
          canvas.toDataURL(
            "image/png"
          );

        const pdf =
          new jsPDF();

        pdf.addImage(
          imgData,
          "PNG",
          10,
          10,
          180,
          0
        );

        pdf.save(
          "expenses.pdf"
        );

      });

  };

  const saveEdit = async () => {

  try {

    const expense =
      expenses[editIndex];

    await fetch(
      `http://localhost:5000/expense/${expense.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          title: editTitle,
          amount: editAmount
        })
      }
    );

    const updated =
      [...expenses];

    updated[
      editIndex
    ].title =
      editTitle;

    updated[
      editIndex
    ].amount =
      editAmount;

    setExpenses(updated);

    setEditIndex(null);

  } catch (err) {

    console.log(err);

    alert("Update Failed");

  }

};
const deleteExpense = async (id) => {

  try {

    await fetch(
      `http://localhost:5000/expense/${id}`,
      {
        method: "DELETE"
      }
    );

    setExpenses(
      expenses.filter(
        item => item.id !== id
      )
    );

  } catch (err) {

    console.log(err);

    alert("Delete Failed");

  }
};
  return (

    <div className="page">

      <h1>
        Expense History
      </h1>

      <Link
        to="/"
        className="back-btn"
      >
        🏠 Dashboard
      </Link>

      <br /><br />

      <button
        onClick={downloadPDF}
      >
        📄 Download PDF
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Search Expense"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <br /><br />

      <select
        value={filterCategory}
        onChange={(e) =>
          setFilterCategory(
            e.target.value
          )
        }
      >

        <option value="">
          All Categories
        </option>

        <option>
          🍔 Food
        </option>

        <option>
          🚕 Travel
        </option>

        <option>
          🛒 Shopping
        </option>

        <option>
          🏠 Rent
        </option>

      </select>

      <br /><br />

      {/* CALENDAR VIEW */}

      <div
className="card"
style={{

background:
document.body.classList.contains(
"dark"
)
?
"#1e1e1e"
:
"white"

}}
>

<h2>
Expense Calendar View 📅
</h2>

        {

          filteredExpenses.map(
            (item, index) => (

              <p key={index}>

                📅 {item.date}

                {" — "}

                {item.title}

                {" — "}

{
(
Number(item.amount) *
(rates[currency] || 1)
).toFixed(2)
}

{" "}

{currency}

              </p>

            )
          )

        }

      </div>

      <br />

      <div ref={pdfRef}>

        <table>

          <thead>

            <tr>

              <th>
                Title
              </th>

              <th>
                Amount
              </th>

              <th>
                Category
              </th>

              <th>
                Date
              </th>

              <th>
                Bill
              </th>

              <th>
                Edit
              </th>

              <th>
                Delete
              </th>

            </tr>

          </thead>

          <tbody>

            {

              filteredExpenses.map(
  (item, index) => (

    <React.Fragment key={index}>

      <tr>

        <td>
          {item.title}
        </td>

        <td>

{
(
Number(item.amount) *
(rates[currency] || 1)
).toFixed(2)
}

{" "}

{currency}

</td>

        <td>
          {item.category}
        </td>

        <td>
          {item.date}
        </td>

        <td>
          {item.billImage && (
            <img
              src={item.billImage}
              alt="bill"
              style={{
                width:"60px",
                height:"60px",
                objectFit:"cover"
              }}
            />
          )}
        </td>

        <td>

          <button
            onClick={() => {

              setEditIndex(index);

              setEditTitle(item.title);

              setEditAmount(item.amount);

            }}
          >
            ✏️ Edit
          </button>

        </td>

        <td>

          <button
            onClick={() =>
              deleteExpense(item.id)
            }
          >
            🗑️ Delete
          </button>

        </td>

      </tr>

      {
        editIndex === index && (

          <tr>

            <td colSpan="7">

              <div
                style={{
                  padding:"15px",
                  background:
document.body.classList.contains(
"dark"
)
?
"#374151"
:
"#f8fafc",
                  borderRadius:"10px"
                }}
              >

                <input
                  value={editTitle}
                  onChange={(e)=>
                    setEditTitle(
                      e.target.value
                    )
                  }
                />

                {" "}

                <input
                  value={editAmount}
                  onChange={(e)=>
                    setEditAmount(
                      e.target.value
                    )
                  }
                />

                {" "}

                <button
                  onClick={saveEdit}
                >
                  Save
                </button>

                {" "}

                <button
                  onClick={() =>
                    setEditIndex(null)
                  }
                >
                  Cancel
                </button>

              </div>

            </td>

          </tr>

        )
      }

    </React.Fragment>

  )
)
                  


            }

          </tbody>

        </table>

      </div>

      <br /><br />
      <h2
  style={{
    textAlign:"center",
    marginTop:"30px"
  }}
>
  Previous Month Archive 📂
</h2>

{

Object.keys(
  groupedExpenses
).length > 0

?

Object.keys(
  groupedExpenses
).map(

(month)=>{

const total =
groupedExpenses[
month
].reduce(

(sum,item)=>

sum +
Number(
item.amount
),

0

);

return (

<div
key={month}
className="card"
style={{
width:"100%",
maxWidth:"1600px",
minHeight:"250px",
margin:"30px auto",
padding:"40px"
}}
>

<h3
style={{
textAlign:"center"
}}
>
{month}
</h3>

<table
style={{
width:"100%",
tableLayout:"auto"
}}
>

<thead>

<tr>

<th>Date</th>
<th>Title</th>
<th>Amount</th>
<th>Category</th>

</tr>

</thead>

<tbody>

{

groupedExpenses[
month
].map(

(item,index)=>(

<tr key={index}>

<td>
{item.date}
</td>

<td>
{item.title}
</td>

<td>

{
(
Number(item.amount) *
(rates[currency] || 1)
).toFixed(2)
}

{" "}

{currency}

</td>

<td>
{item.category}
</td>

</tr>

)

)

}

</tbody>

</table>

<h3
style={{
textAlign:"right",
marginTop:"10px"
}}
>

Total:

{
(
total *
(rates[currency] || 1)
).toFixed(2)
}

{" "}

{currency}

</h3>
</div>

);

}

)

:

<div className="card">

<p>
No Previous Month Expenses
</p>

</div>

}

    </div>

  );

}

export default History;