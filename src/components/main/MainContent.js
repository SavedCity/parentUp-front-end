import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MainContent() {
  const [childrenData, setChildrenData] = useState([]);
  const [dataError, setDataError] = useState(false);
  const [logOutError, setLogOutError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // fetchChildrenData();
  }, []);

  const fetchChildrenData = async () => {
    const data = await axios
      .get("http://127.0.0.1:8000/api/children")
      .then((res) => res.data)
      .catch((err) => {
        setDataError(true);
      });

    setChildrenData(data);
    setLoadingData(false);
  };

  const userSignOut = async () => {
    setLogOutError("");

    try {
      await signOut();
      navigate("/signin");
    } catch {
      setLogOutError("Failed to sign out");
    }
  };

  //   if (!loadingData) console.log(childrenData);

  if (dataError) {
    return <h1>ERROR RETRIEVING DATA</h1>;
  }
  return (
    <div>
      {currentUser && <h4>Hello {currentUser.email}</h4>}
      <h2>Main content</h2>
      {childrenData.map((child) => {
        return child.first_name;
      })}
      <button onClick={userSignOut}>Sign out</button>
    </div>
  );
}
