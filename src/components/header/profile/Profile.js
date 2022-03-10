import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ".././styles/Profile.scss";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import AddChildModal from "./AddChildModal";
import EditMyProfile from "./EditMyProfile";
import { AiFillEdit } from "react-icons/ai";

export default function Profile() {
  const [infoEditable, setInfoEditable] = useState(false);
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

  const toggleEdit = () => {
    setInfoEditable(!infoEditable);
  };

  return (
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
      {!dataLoading ? (
        <div className="profile-main">
          <div className="main-user-info-container">
            {!infoEditable ? (
              <div className="user-personal-info">
                <div>
                  <img src={userInfo.photo_url} alt={userInfo.photo_name} />
                  <section className="names-section">
                    <input
                      id="profile-full-name"
                      value={userInfo.full_name}
                      readOnly
                    />
                    <input
                      id="profile-username"
                      value={userInfo.username}
                      readOnly
                    />
                  </section>
                </div>
                <AiFillEdit
                  className="toggle-edit-profile"
                  onClick={toggleEdit}
                />
              </div>
            ) : (
              <EditMyProfile toggleEdit={toggleEdit} />
            )}
          </div>

          <div className="additional-user-info-container">
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
        </div>
      ) : null}
    </div>
  );
}
