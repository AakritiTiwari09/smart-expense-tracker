import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AddExpense({
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

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  // BILL IMAGE
  const [billImage,
    setBillImage] =
    useState("");

  // RECURRING
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
    expense_date:
      new Date()
        .toISOString()
        .split("T")[0]

  };

  try {

    const response =
      await fetch(
        "http://localhost:5000/add-expense",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            newExpense
          )
        }
      );


    const data =
      await response.json();


    alert(data.message);

    setTitle("");
    setAmount("");
    setCategory("");
    setBillImage("");
    setIsRecurring(false);

  }

  catch(err) {

    console.log(err);

    alert(
      "Failed to save expense"
    );

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

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >

        <option value="">
          Select Category
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

        <option>
          📱 Recharge
        </option>

        <option>
          🎬 Entertainment
        </option>

        <option>
          💡 Bills
        </option>

        <option>
          💊 Medical
        </option>

        <option>
          📚 Education
        </option>

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

      <button onClick={addExpense}>
        Add Expense
      </button>

      <br /><br />

    </div>

  );
}