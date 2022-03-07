import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Child() {
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();
  const { childId } = useParams();

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  return (
    <div>
      {userInfo.children &&
        userInfo.children
          .filter((child) => child.date_added.seconds.toString() === childId)
          .map((child, key) => {
            const { name, photo_url, dob, pob, gender } = child;
            return (
              <div key={key}>
                <h1>
                  {name} ({gender})
                </h1>
                <img src={photo_url} style={{ width: "25%" }} />
                <h3>Born {dob}</h3>
                <p>Born in {pob}</p>
              </div>
            );
          })}
    </div>
  );
}
