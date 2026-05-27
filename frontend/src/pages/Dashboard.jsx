import { Link } from "react-router-dom";

import {
  useState,
  useEffect
} from "react";
import ChatBot from "../components/ChatBot";
function Dashboard({
  expenses,
  setIsLoggedIn,
  darkMode,
  setDarkMode,
  currency,
  setCurrency
}) {

  const [rates,
  setRates] =
  useState({

    INR:1

  });
  const [showSettings,
    setShowSettings] =
    useState(false);
    const [showCalculator,
  setShowCalculator] =
  useState(false);

const [calcInput,
  setCalcInput] =
  useState("");

const [calcResult,
  setCalcResult] =
  useState("");
  const [showCurrency,
  setShowCurrency] =
  useState(false);


  const [profileName,
    setProfileName] =
    useState("");

  const [profileImage,
    setProfileImage] =
    useState("");

  // LOAD PROFILE

  useEffect(() => {

  const savedName =
    localStorage.getItem(
      "profileName"
    );

  const savedImage =
    localStorage.getItem(
      "profileImage"
    );
    
    

  if (savedName) {

    setProfileName(
      savedName
    );

  }

  if (savedImage) {

    setProfileImage(
      savedImage
    );

  }

}, []);
useEffect(() => {

  fetch(
    "https://open.er-api.com/v6/latest/INR"
  )

  .then(
    res => res.json()
  )

  .then(
    data => {

      setRates(
        data.rates
      );

    }
  );

}, []);

  const total =
    expenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount),
      0
    );
  let topCategory =
    "None";

  const categoryTotals = {};

  expenses.forEach((item) => {

    if (
      categoryTotals[item.category]
    ) {

      categoryTotals[
        item.category
      ]++;

    }

    else {

      categoryTotals[
        item.category
      ] = 1;

    }

  });

  let max = 0;

  Object.entries(
    categoryTotals
  ).forEach(([key, value]) => {

    if (value > max) {

      max = value;

      topCategory = key;
    }

  });

  // LOGOUT

  const logoutUser = () => {

    setIsLoggedIn(false);

    localStorage.removeItem(
      "isLoggedIn"
    );

  };

  return (

    <div
      className="page"

      style={{
        paddingTop:"80px",
        position:"relative",
        textAlign:"center"
      }}
    >

      {/* SETTINGS */}

      <div
        style={{
          position:"absolute",
          top:"20px",
          right:"20px"
        }}
      >

        <button

          onClick={() =>
            setShowSettings(
              !showSettings
            )
          }

        >

          ⚙️ Settings

        </button>

        {

          showSettings && (

            <div

              style={{
  background:"white",
  padding:"8px",
  borderRadius:"10px",
  marginTop:"10px",
  boxShadow:
    "0 0 10px rgba(0,0,0,0.2)",
  width:"250px"
}}

            >

              {/* DARK MODE */}

              <button

                onClick={() => {

  const newMode =
    !darkMode;

  setDarkMode(
    newMode
  );

  localStorage.setItem(
    "darkMode",
    newMode
  );

}}
                style={{
  width:"220px",
  height:"40px",
  margin:"5px auto",
  display:"block"
}}

              >

                {
                  darkMode
                  ? "☀️ Light Mode"
                  : "🌙 Dark Mode"
                }

              </button>
              <button

  onClick={() =>
    setShowCalculator(
      !showCalculator
    )
  }

 style={{
  width:"220px",
  height:"40px",
  margin:"5px auto",
  display:"block"
}}

>

  🧮 Calculator

</button>
<button

  onClick={() =>
    setShowCurrency(
      !showCurrency
    )
  }

  style={{
  width:"220px",
  height:"40px",
  margin:"5px auto",
  display:"block"
}}

>

  💱 Change Currency

</button>
{
  showCurrency && (

    <select

value={currency}

onChange={(e)=>{

setCurrency(
e.target.value
);

localStorage.setItem(
"currency",
e.target.value
);
// window.location.reload();

}}

>

<option value="INR">
🇮🇳 Indian Rupee (INR)
</option>

<option value="USD">
🇺🇸 US Dollar (USD)
</option>

<option value="EUR">
🇪🇺 Euro (EUR)
</option>

<option value="GBP">
🇬🇧 British Pound (GBP)
</option>

<option value="JPY">
🇯🇵 Japanese Yen (JPY)
</option>

<option value="AUD">
🇦🇺 Australian Dollar
</option>

<option value="CAD">
🇨🇦 Canadian Dollar
</option>

<option value="SGD">
🇸🇬 Singapore Dollar
</option>

<option value="AED">
🇦🇪 UAE Dirham
</option>

<option value="CNY">
🇨🇳 Chinese Yuan
</option>

<option value="CHF">
🇨🇭 Swiss Franc
</option>

<option value="RUB">
🇷🇺 Russian Ruble
</option>

<option value="KRW">
🇰🇷 South Korean Won
</option>

<option value="THB">
🇹🇭 Thai Baht
</option>

<option value="MYR">
🇲🇾 Malaysian Ringgit
</option>

<option value="ZAR">
🇿🇦 South African Rand
</option>

<option value="BRL">
🇧🇷 Brazilian Real
</option>

<option value="MXN">
🇲🇽 Mexican Peso
</option>

<option value="NZD">
🇳🇿 New Zealand Dollar
</option>

</select>
  )
}


              {/* PROFILE */}

              <Link to="/profile">

                <button

                  style={{
  width:"220px",
  height:"40px",
  margin:"5px auto",
  display:"block"
}}

                >

                  👤 Profile

                </button>

              </Link>

              {/* LOGOUT */}

              <button

                onClick={logoutUser}

                style={{
  width:"220px",
  height:"40px",
  margin:"5px auto",
  display:"block"
}}

              >

                Logout

              </button>

            </div>

          )

        }

      </div>
      
      {
  showCalculator && (

    <div
      className="card"
      style={{
        width:"400px",
        margin:"20px auto"
      }}
    >

      <h2>
        🧮 Calculator
      </h2>

      <input
        type="text"
        value={calcInput}
        placeholder="1000+500-200"
        onChange={(e)=>
          setCalcInput(
            e.target.value
          )
        }
      />

      <br /><br />

      <button

        onClick={() => {

          try {

            setCalcResult(
              eval(calcInput)
            );

          }

          catch {

            setCalcResult(
              "Invalid Input"
            );

          }

        }}

      >

        Calculate

      </button>

      <br /><br />

      <h3>

        Result:
        {" "}
        {calcResult}

      </h3>

    </div>

  )
}

      {/* TITLE */}

      <h1 className="logo-title">
  Smart Expense Tracker
</h1>
      {/* USER */}

      <h2>

        Welcome,
        {" "}

        {profileName}

      </h2>

      {/* PROFILE PHOTO */}

      {

        profileImage && (

          <img
            src={profileImage}
            alt="profile"

            style={{
              width:"100px",
              height:"100px",
              borderRadius:"50%",
              objectFit:"cover",
              marginTop:"10px",
              border:"3px solid #2563eb"
            }}
          />

        )

      }

      <br /><br />

      {/* MENU */}

      <div
        className="menu"

        style={{
          justifyContent:"center",
          marginTop:"20px"
        }}
      >

        <Link to="/add">
          Add Expense
        </Link>

        <Link to="/history">
          History
        </Link>

        <Link to="/analytics">
          Analytics
        </Link>

        <Link to="/budget">
          Budget
        </Link>

      </div>

      <br /><br />

      {/* DASHBOARD CARDS */}

      <div className="cards">

        <div className="card">

          <h2>

{
  rates[currency]

  ?

  (
    total *
    rates[currency]
  ).toFixed(2)

  :

  total
}

{" "}
{currency}

</h2>

          <p>
            Total Expenses
          </p>

        </div>

        <div className="card">

          <h2>
            {expenses.length}
          </h2>

          <p>
            Total Transactions
          </p>

        </div>

        <div className="card">

          <h2>
            {topCategory}
          </h2>

          <p>
            Top Category
          </p>

        </div>

      </div>
       <ChatBot expenses={expenses} />
    </div>
    

  );
}

export default Dashboard;