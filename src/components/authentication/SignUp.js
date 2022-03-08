import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SignUp() {
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const fullNameRef = useRef("");
  const [usernameErr, setUsernameErr] = useState(false);
  const { signUp } = useAuth();
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const { db } = useAuth();

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const fieldValue = usernameRef.current.value.toLowerCase();

    const data = query(
      collection(db, "users"),
      where("username", "==", fieldValue)
    );
    const snapshot = await getDocs(data);
    let existingUsername;
    snapshot.forEach((doc) => {
      existingUsername = doc.data().username.toLowerCase();
    });
    if (fieldValue === existingUsername) {
      setUsernameErr(true);
      return;
    }
    setUsernameErr(false);
    try {
      setLoginErr("");
      setLoginLoading(true);
      await signUp(
        emailRef.current.value,
        passwordRef.current.value,
        usernameRef.current.value,
        fullNameRef.current.value
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
      {usernameErr && "Username already exists!"}
      <form className="signup-form" onSubmit={handleSignUpSubmit}>
        <div className="email-box">
          <label htmlFor="email">Email</label>
          <input
            required
            id="email"
            type="email"
            ref={emailRef}
            placeholder="Email Address"
          />
        </div>

        <div className="password-box">
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            type="password"
            ref={passwordRef}
            placeholder="New Password"
          />
        </div>

        <div className="full-name-box">
          <label htmlFor="full-name">Full Name</label>
          <input id="full-name" required type="text" ref={fullNameRef} />
        </div>

        <div className="username-box">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            required
            type="text"
            ref={usernameRef}
            placeholder="Username"
          />
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
