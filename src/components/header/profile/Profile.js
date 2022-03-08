import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ".././styles/Profile.scss";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import AddChildModal from "./AddChildModal";
import EditMyProfile from "./EditMyProfile";

export default function Profile() {
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();

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
      {!dataLoading ? (
        <div>
          {/* TOAST  */}
          <div className="success-toast">
            <span>
              Successfully added{" "}
              {userInfo.children &&
                userInfo.children[userInfo.children.length - 1] &&
                userInfo.children[userInfo.children.length - 1].name}
              !
            </span>
          </div>

          <img
            src={userInfo.photo_url}
            alt={userInfo.photo_name}
            style={{ width: "14%" }}
          />
          <h3>{userInfo.username}</h3>
          <h3>{userInfo.full_name}</h3>

          <EditMyProfile />

          <button onClick={openModalAddChild}>Add child</button>
          <AddChildModal />
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
