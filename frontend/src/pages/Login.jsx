import { useState } from "react";
import {
  signInWithPopup
} from "firebase/auth";

import {
  auth,
  provider
} from "../firebase";

function Login({
  setIsLoggedIn,
  setUser
}) {

  const googleLogin = async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      // SAVE USER DATA

      localStorage.setItem(
        "profileName",
        result.user.displayName || "User"
      );

      localStorage.setItem(
        "profileEmail",
        result.user.email || ""
      );

      localStorage.setItem(
        "profileImage",
        result.user.photoURL || ""
      );

      // SAVE LOGIN

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      setUser(result.user);

      setIsLoggedIn(true);

      alert("Login Successful");

    }

    catch (error) {
  console.log(error);
  alert(error.message);
}

  };

  return (

    <div className="login-container">

      <div className="login-box">

        <h1>
          Expense Tracker
        </h1>

        <button
          onClick={googleLogin}
        >

          Sign in with Google

        </button>

      </div>

    </div>

  );
}

export default Login;