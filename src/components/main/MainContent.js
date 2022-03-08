import { useEffect } from "react";
// import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function MainContent() {
  // const [childrenData, setChildrenData] = useState([]);
  // const [dataError, setDataError] = useState(false);
  // const [loadingData, setLoadingData] = useState(true);
  const { userInfo, userCollection } = useAuth();

  useEffect(() => {
    // fetchChildrenData();
    userCollection();
  }, []); // eslint-disable-line

  // const fetchChildrenData = async () => {
  //   const data = await axios
  //     .get("http://127.0.0.1:8000/api/children")
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       setDataError(true);
  //     });

  //   setChildrenData(data);
  //   setLoadingData(false);
  // };

  // if (dataError) {
  //   return <h1>ERROR RETRIEVING DATA</h1>;
  // }
  return (
    <div>
      <h3>{userInfo.username && "Hello " + userInfo.username}</h3>
      <h2>Main content</h2>
      {/* {childrenData.map((child) => {
        return child.first_name;
      })} */}
    </div>
  );
}
