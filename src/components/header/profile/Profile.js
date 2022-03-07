import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Profile.scss";
import {
  doc,
  // setDoc,
  updateDoc,
  // arrayUnion,
  arrayRemove,
  // deleteField,
  // FieldValue,
} from "firebase/firestore";
import { useRef } from "react";
import AddChildModal from "./AddChildModal";

export default function Profile() {
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();
  const photoRef = useRef("");
  const dobRef = useRef("");
  const pobRef = useRef("");

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  const openModalAddChild = () => {
    let modal = document.getElementById("addChildModal");
    modal.style.display = "block";
  };

  const removeChild = async (child) => {
    const userDoc = doc(db, "users", currentUser.uid);
    await updateDoc(userDoc, {
      children: arrayRemove(child),
    });
    userCollection();
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {!dataLoading ? (
        <div>
          <div className="success-toast">
            <span>
              Successfully Added{" "}
              {userInfo.children[userInfo.children.length - 1] &&
                userInfo.children[userInfo.children.length - 1].name}
              !
            </span>
          </div>
          <h1>My profile</h1>
          <h3>My username: {userInfo.username}</h3>

          <button onClick={openModalAddChild}>Add child</button>
          <AddChildModal photoRef={photoRef} dobRef={dobRef} pobRef={pobRef} />
          {userInfo.children &&
            userInfo.children.map((child, key) => {
              const { name, dob, gender, photo_name, photo_url } = child;
              return (
                <div key={key}>
                  <Link to={`child-${name}`}>{name}</Link>
                  <h3>{dob}</h3>
                  <h3>{gender}</h3>
                  <img
                    src={photo_url}
                    alt={photo_name}
                    style={{ width: "10%" }}
                  />

                  <button onClick={(e) => removeChild(child)}>Remove</button>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
