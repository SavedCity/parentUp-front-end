import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
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
              Successfully added{" "}
              {userInfo.children &&
                userInfo.children[userInfo.children.length - 1] &&
                userInfo.children[userInfo.children.length - 1].name}
              !
            </span>
          </div>
          <h1>My profile</h1>
          <h3>My username: {userInfo.username}</h3>
          <Link to="edit">Edit profile</Link>
          <Outlet />
          <br />
          <br />
          <br />

          <button onClick={openModalAddChild}>Add child</button>
          <AddChildModal photoRef={photoRef} dobRef={dobRef} pobRef={pobRef} />
          {userInfo.children &&
            userInfo.children.map((child, key) => {
              const { name, date_added } = child;
              let id = date_added.seconds.toString();
              return (
                <div key={key}>
                  <Link to={id}>{name}</Link>
                  <button onClick={(e) => removeChild(child)}>Remove</button>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
