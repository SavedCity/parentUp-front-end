import { useState, useEffect } from "react";
import axios from "axios";

export default function MainContent() {
  const [childrenData, setChildrenData] = useState([]);
  const [dataError, setDataError] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchChildrenData();
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
  if (!loadingData) console.log(childrenData);

  return (
    <div>
      {childrenData.map((child) => {
        return child.first_name;
      })}
    </div>
  );
}
