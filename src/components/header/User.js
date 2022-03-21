import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";

export default function User() {
  const { userId } = useParams();

  useEffect(() => {
    getSearchedUser();
  });

  const getSearchedUser = async () => {
    const userDoc = doc(db, "users", userId);
    const data = await getDoc(userDoc).then((doc) => doc.data());
    console.log(data);
  };

  return <div>{userId}</div>;
}
