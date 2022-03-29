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
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const searchResultRef = useRef();
  const location = useLocation();
  const [localUsers, setLocalUsers] = useState([]);

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
    document.addEventListener("click", handleClickOutside, true);
    setSearchToDefault();
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
    setIsSearchResultVisible(false);
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
        setIsSearchResultVisible(true);
      }
      setNoUserFound(false);
    });
    if (searchField.trim() && existingUsername.length < 1) {
      setIsSearchResultVisible(true);
      setNoUserFound(true);
    }
    setFirstFoundUser(...existingUsername);
    setUsers(existingUsername);
    setLoadingSearch(false);
    console.log(localUsers);
    if (localUsers.length) {
      setIsSearchResultVisible(true);
    }
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

  const fetchLocalUsers = () => {
    let currentLocalUsers = JSON.parse(
      localStorage.getItem("searchedUserHistory")
    );
    setLocalUsers(currentLocalUsers);
    if (currentLocalUsers && currentLocalUsers.length) {
      setIsSearchResultVisible(true);
    }
  };

  const removeLocalUser = (user) => {
    let currentLocalUsers = JSON.parse(
      localStorage.getItem("searchedUserHistory")
    );
    const userToRemove = currentLocalUsers.findIndex((userToFind) => {
      return userToFind.uid === user.uid;
    });
    currentLocalUsers.splice(userToRemove, 1);
    localStorage.setItem(
      "searchedUserHistory",
      JSON.stringify(currentLocalUsers)
    );
    setLocalUsers(currentLocalUsers);
    if (!currentLocalUsers.length) {
      setIsSearchResultVisible(false);
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
            onFocus={searchUsersVal ? handleSearchUsersChange : fetchLocalUsers}
          />
        </form>
        <div>
          {loadingSearch ? (
            <div id="search-result-loader"></div>
          ) : (
            <VscSearch />
          )}
        </div>

        {isSearchResultVisible && (
          <div className="search-results">
            {users && users.length && !noUserFound ? (
              <>
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
              </>
            ) : localUsers &&
              localUsers.length &&
              !noUserFound &&
              !searchUsersVal ? (
              <>
                <span className="recently-viewed-searched-users">
                  Recently Viewed
                </span>
                {localUsers.map((user, key) => {
                  const { username, uid } = user;
                  return (
                    <div key={key} className="recently-viewed-info-container">
                      <Link
                        // className={
                        //   key % 2 === 0
                        //     ? "search-result-link-even"
                        //     : "search-result-link-odd"
                        // }
                        to={`/user/${uid}`}
                        onClick={() => saveSearchedUserHistoryLocally(user)}
                      >
                        <p>{username}</p>
                      </Link>
                      <span
                        onClick={() => {
                          removeLocalUser(user);
                        }}
                      >
                        x
                      </span>
                    </div>
                  );
                })}
              </>
            ) : noUserFound ? (
              <>
                <p className="no-user-found">No user found</p>
              </>
            ) : null}
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
