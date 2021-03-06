import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function PasswordReset() {
  const [passwordSentMessage, setPasswordSentMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const emailRef = useRef();
  const { resetPassword } = useAuth();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    try {
      setPasswordSentMessage("");
      setPasswordError("");
      setLoginLoading(true);
      await resetPassword(emailRef.current.value);
      setPasswordSentMessage("Password reset sent to " + passwordInputValue);
    } catch (err) {
      setPasswordError("Failed to reset password");
      console.log(err);
    }

    setLoginLoading(false);
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {passwordSentMessage && passwordSentMessage}
      {passwordError && passwordError}
      <form id="reset-password-form" onSubmit={handleSignInSubmit}>
        <div className="email-box">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            ref={emailRef}
            placeholder="Email Address"
            onChange={(e) => setPasswordInputValue(e.target.value)}
          />
        </div>
        <button disabled={loginLoading} type="submit">
          Reset Password
        </button>
      </form>
      <div>
        Back to <Link to="/signin">Sign In</Link>
      </div>
      <div>
        Create an account: <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
