import { useRef, useState } from "react";
import "./styles/Header.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { VscSearch } from "react-icons/vsc";
import { db } from "../../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function Header() {
  const [searchUsersVal, setSearchUsersVal] = useState("");
  const [users, setUsers] = useState([]);
  const [foundUser, setFoundUser] = useState("");

  const searchUserValRef = useRef("");

  const { signOut, currentUser, userInfo } = useAuth();
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
      collection(db, "users")
      // where("usernameLC", "==", searchField)
    );

    // const userDoc = doc(db, "users", userInfo.uid);
    // const data = await getDoc(userDoc).then((doc) => doc.data());
    // console.log(data);

    const snapshot = await getDocs(data);
    let existingUsername = [];
    snapshot.forEach((doc) => {
      existingUsername.push(doc.data());
      setFoundUser(existingUsername);
    });
    setUsers(existingUsername);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (foundUser) {
      navigate(`/user/${foundUser.uid}`);
    }
  };

  return (
    <div className="header-container">
      <div className="header-logo-box">
        <h2>parentUP</h2>
      </div>
      <div className="search-bar">
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleSearchUsersChange}
            placeholder="Search users (username)"
            type="search"
            ref={searchUserValRef}
            value={searchUsersVal}
          />
        </form>
        <div>
          <VscSearch />
        </div>
        {users.length !== 0 && (
          <div className="search-results">
            {users.map((user, key) => {
              const { username, uid } = user;
              return (
                <Link
                  className={
                    key % 2 === 0
                      ? "search-result-link-even"
                      : "search-result-link-odd"
                  }
                  to={`/user/${uid}`}
                  key={key}
                >
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
