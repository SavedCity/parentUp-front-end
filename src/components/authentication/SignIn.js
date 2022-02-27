import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const isMounted = useRef(false);
  let location = useLocation();

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoginErr("");
      setLoginLoading(true);
      await signIn(emailRef.current.value, passwordRef.current.value);
      navigate(location.state ? location.state.from.pathname : "/");
    } catch (err) {
      setLoginErr("Failed to sign in");
      console.log(err);
    }

    setLoginLoading(false);
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {loginErr && loginErr}
      {currentUser && currentUser.email}
      <form onSubmit={handleSignInSubmit}>
        <div className="email-box">
          <label htmlFor="email">Email</label>
          <input type="email" ref={emailRef} placeholder="Email Address" />
        </div>
        <div className="password-box">
          <label htmlFor="password">Password</label>
          <input type="password" ref={passwordRef} placeholder="Password" />
        </div>
        <button disabled={loginLoading} type="submit">
          Sign In
        </button>
      </form>
      <div>
        <Link to="password-reset">Forgot Password</Link>
      </div>
      <div>
        Create an account: <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
