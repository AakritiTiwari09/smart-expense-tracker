import "./App.css";


import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import { saveAs }
from "file-saver";

import {
  useState,
  useEffect,
  useRef
} from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";

import {
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function AddExpense({
  expenses,
  setExpenses
}) {

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [date, setDate] =
    useState(
      new Date()
      .toISOString()
      .split("T")[0]
    );

  const [billImage,
    setBillImage] =
    useState("");

  const [isRecurring,
    setIsRecurring] =
    useState(false);

  // VOICE FEATURE

  const startVoice = () => {

    const recognition =
      new window.webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
      (event) => {

        const text =
          event.results[0][0]
            .transcript;

        const words =
          text.split(" ");

        const amt =
          words.find(
            word =>
            !isNaN(word)
          );

        setAmount(amt || "");

        if (
          text.includes("food")
        ) {

          setCategory(
            "🍔 Food"
          );

        }

        else if (
          text.includes("travel")
        ) {

          setCategory(
            "🚕 Travel"
          );

        }

        else if (
          text.includes("shopping")
        ) {

          setCategory(
            "🛒 Shopping"
          );

        }

        else if (
          text.includes("rent")
        ) {

          setCategory(
            "🏠 Rent"
          );

        }

        setTitle(text);
      };
  };
const addExpense = async () => {

  if (!title || !amount || !category) {
    alert("Fill all fields");
    return;
  }

  const newExpense = {
    category,
    amount,
    description: title,
    expense_date: date
  };

  try {

    const response = await fetch(
      "http://localhost:5000/add-expense",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExpense)
      }
    );

    const data = await response.json();

    alert(data.message);

    setExpenses([
      ...expenses,
      {
        title,
        amount,
        category,
        date,
        month: new Date(date).getMonth(),
        year: new Date(date).getFullYear(),
        recurring: isRecurring,
        billImage
      }
    ]);

    setTitle("");
    setAmount("");
    setCategory("");
    setBillImage("");
    setIsRecurring(false);

  } catch (err) {

    console.log(err);

    alert("Failed to save expense");

  }
};
 
  return (

    <div className="page">

      <h1>Add Expense</h1>

      <Link
        to="/"
        className="back-btn"
      >
        🏠 Dashboard
      </Link>

      <br /><br />

      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
      />

      <br /><br />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >

        <option value="">
          Select Category
        </option>

        <option>🍔 Food</option>
        <option>🚕 Travel</option>
        <option>🛒 Shopping</option>
        <option>🏠 Rent</option>
        <option>💳 EMI</option>
        <option>🎬 Netflix</option>
        <option>🔁 Subscription</option>
        <option>📦 Amazon Prime</option>
        <option>🏋️ Gym Membership</option>
        <option>📱 Recharge</option>
        <option>🎬 Entertainment</option>
        <option>💡 Bills</option>
        <option>💊 Medical</option>
        <option>📚 Education</option>

      </select>

      <br /><br />

      {/* BILL IMAGE */}

      <input
        type="file"

        onChange={(e) => {

          const file =
            e.target.files[0];

          if (file) {

            const reader =
              new FileReader();

            reader.onloadend =
              () => {

                setBillImage(
                  reader.result
                );

              };

            reader.readAsDataURL(
              file
            );

          }

        }}
      />

      <br /><br />

      {/* RECURRING */}

      <label>

        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) =>
            setIsRecurring(
              e.target.checked
            )
          }
        />

        {" "}
        Recurring Expense 🔁

      </label>

      <br /><br />

      <button
  onClick={() => {
    addExpense();
  }}
>
  Add Expense
</button>

      <br /><br />

      <button onClick={startVoice}>
        🎤 Voice Entry
      </button>

    </div>

  );
}

function History({ expenses,setExpenses,currency,darkMode}) {
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
          month:"long",
          year:"numeric"
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
        Download PDF
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

        <option>🍔 Food</option>
        <option>🚕 Travel</option>
        <option>🛒 Shopping</option>
        <option>🏠 Rent</option>

      </select>

      <br /><br />
      {/* EXPENSE CALENDAR VIEW */}

<div

  style={{

    width:"100%",

    maxWidth:"1200px",

    margin:"20px auto",

    background:
darkMode
?
"#1e1e1e"
:
"white",

    padding:"30px",

    borderRadius:"20px",

    boxShadow:
      "0 8px 20px rgba(0,0,0,0.1)",

    boxSizing:"border-box",

    textAlign:"left"

  }}

>

  <h2

    style={{

      textAlign:"center",

      marginBottom:"20px"

    }}

  >

    Expense Calendar View 📅

  </h2>

  {

    filteredExpenses.length > 0

    ?

    filteredExpenses.map(

      (item, index) => (

      <div

        key={index}

        style={{

          padding:"15px",

          marginBottom:"12px",

          borderRadius:"12px",

          background:
darkMode
?
"#374151"
:
"#f8fafc",

          border:
            "1px solid #e5e7eb",

          fontSize:"16px",

          display:"flex",

          justifyContent:
            "space-between",

          flexWrap:"wrap"

        }}

      >

        <span>

          📅 {item.date}

        </span>

        <span>

          {item.title}

        </span>

        <span>

{
(
Number(item.amount) *
(rates[currency] || 1)
).toFixed(2)
}

{" "}

{currency}

</span>

      </div>

    ))

    :

    <p

      style={{

        textAlign:"center",

        color:"gray"

      }}

    >

      No expenses found

    </p>

  }

</div>
      <br />

      <div ref={pdfRef}>

        <table>

          <thead>

  <tr>

    <th>Title</th>
    <th>Amount</th>
    <th>Category</th>
    <th>Date</th>
    <th>Bill</th>
    <th>Edit</th>
    <th>Delete</th>

  </tr>

</thead>

          <tbody>

            {
              

              filteredExpenses.map(
                (item, index) => (

                <tr key={index}>

                  <td>

                    {item.title}

                    {

                      item.recurring &&

                      <span
                        style={{
                          color:"green",
                          fontWeight:"bold"
                        }}
                      >

                        {" "}
                        🔁 Recurring

                      </span>

                    }

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

                    {

                      item.billImage &&

                      <img
                        src={item.billImage}
                        alt="bill"

                        style={{
                          width:"60px",
                          height:"60px",
                          objectFit:"cover"
                        }}
                      />

                    }

                  </td>
                  <td>

  <button

    onClick={() => {

      setEditIndex(
        index
      );

      setEditTitle(
        item.title
      );

      setEditAmount(
        item.amount
      );

    }}

  >

    ✏️ Edit

  </button>

</td>

<td>

  <button

   onClick={() =>
  deleteExpense(
    item.id
  )
}

  >

    🗑️ Delete

  </button>

</td>
{
  editIndex === index && (

    <tr>

      <td colSpan="7">

        <div
          style={{
            padding:"15px",
            background:
darkMode
?
"#374151"
:
"#f1f5f9",
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

                </tr>
          

              ))


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
Number(item.amount),

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
margin:"20px auto",
padding:"30px"
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
textAlign:"right"
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

function Analytics({ expenses,currency,darkMode }) {
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
  const categoryTotals = {};
  const currentMonth =
  new Date()
  .getMonth();

const currentYear =
  new Date()
  .getFullYear();

const currentMonthExpenses =
  expenses.filter(

    (item)=>

      item.month ===
      currentMonth

      &&

      item.year ===
      currentYear

  );

  currentMonthExpenses.forEach((item) => {

    if (
      categoryTotals[item.category]
    ) {

      categoryTotals[
        item.category
      ] += Number(item.amount);

    }

    else {

      categoryTotals[
        item.category
      ] = Number(item.amount);

    }

  });

  const totalExpense =
    Object.values(
      categoryTotals
    ).reduce(
      (a, b) => a + b,
      0
    );

  let insight =
    "Expenses look balanced";

  let suggestion =
    "Your spending habits are good.";

  Object.entries(
    categoryTotals
  ).forEach(([key, value]) => {

    if (
      value >
      totalExpense * 0.5
    ) {

      insight =
        `${key} expenses are too high`;

      suggestion =
        `Reduce ${key} expenses by 15%`;

    }

  });

  const labels =
    Object.keys(categoryTotals);

  const values =
    Object.values(categoryTotals);

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

    labels: labels,

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

      <br /><br />

      <div

  style={{

    width:"95%",

    maxWidth:"1100px",

    margin:"20px auto",

    background:
darkMode
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

  <br />

  <h3>
    Total Categories:
    {" "}
    {labels.length}
  </h3>

  <h3>
  Total Expense:

  {
    (
      totalExpense *
      (rates[currency] || 1)
    ).toFixed(2)
  }

  {" "}
  {currency}
</h3>
</div>
      <br />

      <div
        style={{
          width:"400px",
          margin:"auto"
        }}
      >

        <Pie data={data} />

      </div>

    </div>

  );
}

function App() {

  const [user, setUser] =
    useState(null);

  const [darkMode,
  setDarkMode] =
  useState(

    localStorage.getItem(
      "darkMode"
    ) === "true"

  );

const [expenses, setExpenses] = useState([]);

  const [isLoggedIn,
    setIsLoggedIn] =
    useState(() => {

      const savedLogin =
        localStorage.getItem(
          "isLoggedIn"
        );

      return savedLogin === "true";
    });
    const [currency,
  setCurrency] =
  useState(

    localStorage.getItem(
      "currency"
    ) || "INR"

  );

  useEffect(() => {

  fetch("http://localhost:5000/expenses")
    .then((res) => res.json())
    .then((data) => {

      const formatted = data.map(item => ({
  id: item.id,
  title: item.description,
  amount: Number(item.amount),
  category: item.category,
  date: item.expense_date,
  month: new Date(item.expense_date).getMonth(),
  year: new Date(item.expense_date).getFullYear()
}));

      setExpenses(formatted);

    })
    .catch((err) => {
      console.log(err);
    });

}, []);

  useEffect(() => {

    localStorage.setItem(
      "isLoggedIn",
      isLoggedIn
    );

  }, [isLoggedIn]);

  useEffect(() => {

  localStorage.setItem(
    "darkMode",
    darkMode
  );

  if (darkMode) {

    document.body.classList.add(
      "dark"
    );

  }

  else {

    document.body.classList.remove(
      "dark"
    );

  }

}, [darkMode]);

  if (!isLoggedIn) {

    return (

      <Login
        setIsLoggedIn={
          setIsLoggedIn
        }
        setUser={setUser}
      />

    );
  }

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Dashboard
  expenses={expenses}
  user={user}
  setIsLoggedIn={setIsLoggedIn}
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  currency={currency}
  setCurrency={setCurrency}
/>
          }
        />

        <Route
          path="/add"
          element={
            <AddExpense
              expenses={expenses}
              setExpenses={setExpenses}
            />
          }
        />

        <Route
  path="/history"
  element={
    <History
      expenses={expenses}
      setExpenses={setExpenses}
       currency={currency}
       darkMode={darkMode}

    />
  }
/>

        <Route
          path="/analytics"
          element={
            <Analytics
              expenses={expenses}
               currency={currency}
               darkMode={darkMode}

            />
          }
        />

        <Route
          path="/budget"
          element={
            <Budget
              expenses={expenses}
               currency={currency}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile />
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;