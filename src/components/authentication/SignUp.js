import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const bioRef = useRef();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoginErr("");
      setLoginLoading(true);
      await signUp(
        emailRef.current.value,
        passwordRef.current.value,
        bioRef.current.value
      );
      navigate("/");
    } catch (err) {
      setLoginErr("Failed to create an account");
      console.log(err);
    }

    setLoginLoading(false);
  };

  return (
    <div>
      {loginErr && loginErr}
      <form onSubmit={handleSignUpSubmit}>
        <div className="email-box">
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} placeholder="Email Address" />
        </div>
        <div className="password-box">
          <label htmlFor="password">Password</label>
          <input type="password" ref={passwordRef} placeholder="New Password" />
        </div>
        <div className="bio-box">
          <label htmlFor="bio">Bio</label>
          <input type="text" ref={bioRef} placeholder="Bio..." />
        </div>
        <button disabled={loginLoading} type="submit">
          Sign Up
        </button>
      </form>
      <div>
        If you have an account: <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
}
