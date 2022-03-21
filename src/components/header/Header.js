import { useRef, useState } from "react";
import "./styles/Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { VscSearch } from "react-icons/vsc";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Header() {
  const [searchUsersVal, setSearchUsersVal] = useState("");
  const [users, setUsers] = useState([]);

  const searchUserValRef = useRef("");

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

  const handleSearchUsersChange = async (e) => {
    setUsers([]);
    setSearchUsersVal(e.target.value);
    searchUserValRef.current = e.target.value;
    let searchField = searchUserValRef.current.value
      ? searchUserValRef.current.value.toLowerCase()
      : searchUserValRef.current.toLowerCase();
    const data = query(
      collection(db, "users"),
      where("usernameLC", "==", searchField)
    );
    const snapshot = await getDocs(data);
    let existingUsername;
    snapshot.forEach((doc) => {
      existingUsername = doc.data();
      setUsers([existingUsername]);
    });
  };
  console.log(users);

  return (
    <div className="header-container">
      <div className="header-logo-box">
        <h2>parentUP</h2>
      </div>
      <div className="search-bar">
        <input
          onChange={handleSearchUsersChange}
          placeholder="Search users (username)"
          type="text"
          ref={searchUserValRef}
          value={searchUsersVal}
        />
        <div>
          <VscSearch />
        </div>
        {users.length !== 0 && (
          <div className="search-results">
            {users.map((user, key) => {
              const { username, uid } = user;
              return (
                <Link to={`/user/${uid}`} key={key}>
                  <p>{username}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="header-links-box">
        <Link to="/">Home</Link>
        <Link to="profile">Profile </Link>
        {currentUser && <button onClick={userSignOut}>Sign out</button>}
      </div>
    </div>
  );
}
