import { useRef, useState } from "react";
import "./styles/Header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { VscSearch } from "react-icons/vsc";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [searchUsersVal, setSearchUsersVal] = useState("");
  const [users, setUsers] = useState([]);
  const [noUserFound, setNoUserFound] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [firstFoundUser, setFirstFoundUser] = useState({});
  const searchUserValRef = useRef("");
  const { signOut, currentUser } = useAuth();
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(true);
  const searchResultRef = useRef();
  const location = useLocation();

  const handleClickOutside = (e) => {
    if (
      searchResultRef.current &&
      !searchResultRef.current.contains(e.target)
    ) {
      setIsSearchResultVisible(false);
    }
  };

  const setSearchToDefault = () => {
    setIsSearchResultVisible(false);
    setUsers([]);
    setSearchUsersVal("");
  };

  useEffect(() => {
    setSearchToDefault();
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [location]);

  const userSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch {
      console.log("Failed to sign out");
    }
  };

  const handleSearchUsersChange = async (e) => {
    setIsSearchResultVisible(true);
    setLoadingSearch(true);
    setUsers([]);
    setSearchUsersVal(e.target.value);
    searchUserValRef.current = e.target.value;
    let searchField = searchUserValRef.current.value
      ? searchUserValRef.current.value.toLowerCase()
      : searchUserValRef.current.toLowerCase();
    const data = query(collection(db, "users"));
    const snapshot = await getDocs(data);
    let existingUsername = [];
    snapshot.forEach((doc) => {
      if (
        doc.data().usernameLC.trim().includes(searchField.trim()) &&
        searchField.trim()
      ) {
        existingUsername.push(doc.data());
      }
      setNoUserFound(false);
    });
    if (searchField.trim() && existingUsername.length < 1) {
      setNoUserFound(true);
    }
    setFirstFoundUser(...existingUsername);
    setUsers(existingUsername);
    setLoadingSearch(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstFoundUser) {
      navigate(`/user/${firstFoundUser.uid}`);
      setSearchToDefault();
      saveSearchedUserHistoryLocally(firstFoundUser);
    }
  };

  const saveSearchedUserHistoryLocally = (user) => {
    let myStorage =
      JSON.parse(localStorage.getItem("searchedUserHistory")) || [];
    let filteredStorage = myStorage.filter((id) => id.uid === user.uid);
    if (!filteredStorage.length) {
      myStorage.push(user);
      localStorage.setItem("searchedUserHistory", JSON.stringify(myStorage));
    }
  };

  return (
    <div className="header-container">
      <div className="header-logo-box">
        <h2>parentUP</h2>
      </div>
      <div ref={searchResultRef} className="search-bar">
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleSearchUsersChange}
            placeholder="Search users (username)"
            type="search"
            ref={searchUserValRef}
            value={searchUsersVal}
            onFocus={searchUsersVal ? handleSearchUsersChange : null}
          />
        </form>
        <div>
          {loadingSearch ? (
            <div id="search-result-loader"></div>
          ) : (
            <VscSearch />
          )}
        </div>
        {isSearchResultVisible && users.length !== 0 ? (
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
                  onClick={() => saveSearchedUserHistoryLocally(user)}
                >
                  <p>{username}</p>
                </Link>
              );
            })}
          </div>
        ) : isSearchResultVisible && noUserFound ? (
          <div className="search-results">
            <p className="no-user-found">No user found</p>
          </div>
        ) : null}
      </div>
      <div className="header-links-box">
        <Link to="/">Home</Link>
        <Link to="profile">Profile </Link>
        {currentUser && <button onClick={userSignOut}>Sign out</button>}
      </div>
    </div>
  );
}
