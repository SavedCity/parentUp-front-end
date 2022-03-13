import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ".././styles/Child.scss";

export default function Child() {
  const { userInfo, userCollection, currentUser, db } = useAuth();
  const { childId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  let filteredChild;
  if (userInfo.children) {
    filteredChild = userInfo.children.filter(
      (child) => child.date_added.seconds.toString() === childId
    );
  }

  const removeChild = async (child) => {
    const userDoc = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(userDoc, {
        children: arrayRemove(child),
      });
      navigate("/profile", {
        state: {
          name: filteredChild[0].name,
          id: filteredChild[0].date_added.seconds.toString(),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {userInfo.children &&
        filteredChild.map((child, key) => {
          const { name, photo_url, dob, pob, gender } = child;
          return (
            <div key={key}>
              <h1>
                {name} ({gender})
              </h1>
              <img src={photo_url} alt={name} style={{ width: "18%" }} />
              <h3>Born {dob}</h3>
              <p>Born in {pob}</p>
              <button onClick={() => removeChild(child)}>Remove</button>
            </div>
          );
        })}
    </div>
  );
}
