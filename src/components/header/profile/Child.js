import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Child() {
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();
  const { child } = useParams();

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  console.log(userInfo);

  if (userInfo.children) {
    let filteredData = userInfo.children.filter(
      (childd) => childd.date_added.seconds.toString() === child
    );
    console.log(filteredData);
    console.log(userInfo.children[0].date_added.seconds);
    console.log(child);
  }
  return (
    <div>
      I am...{child}
      {userInfo.children &&
        userInfo.children.map((child) => {
          return <div>{child.date_added.seconds}</div>;
        })}
    </div>
  );
}
