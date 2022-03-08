import ".././styles/Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Header() {
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();

  const userSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch {
      console.log("Failed to sign out");
    }
  };
  return (
    <div className="header-container">
      <div className="header-logo-box">
        <h2>parentUP</h2>
      </div>
      <div className="header-links-box">
        <Link to="/">Home</Link>
        <Link to="profile">Profile </Link>
        {currentUser && <button onClick={userSignOut}>Sign out</button>}
      </div>
    </div>
  );
}
