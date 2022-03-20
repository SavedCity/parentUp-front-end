import { collection, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";

export default function User() {
  const { userId } = useParams();
  console.log(userId);

  const getSearchedUser = async () => {
    const data = query(collection(db, "users"), where("usernameLC", "=="));
  };

  return <div>some user</div>;
}
