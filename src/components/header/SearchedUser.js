import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import "./styles/SearchedUser.scss";

export default function SearchedUser() {
  const [userData, setUserData] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    const getSearchedUser = async () => {
      const userDoc = doc(db, "users", userId);
      const data = await getDoc(userDoc).then((doc) => doc.data());
      setUserData(data);
    };
    getSearchedUser();
  }, [userId]);

  return (
    <div className="profile-main">
      {userData ? (
        <>
          <div className="main-user-info-container">
            <div>
              <div className="user-personal-info">
                {userData.photo_url ? (
                  <img src={userData.photo_url} alt={userData.photo_name} />
                ) : (
                  <span className="default-user-img-placeholder">
                    {userData.full_name && userData.full_name.charAt(0)}
                  </span>
                )}
                <section className="names-section">
                  <input
                    id="profile-full-name"
                    value={userData.full_name || ""}
                    readOnly
                  />
                  <input
                    id="profile-username"
                    value={userData.username || ""}
                    readOnly
                  />
                </section>
              </div>
            </div>
          </div>

          {/* /////// ADDITIONAL INFO FOR USER SECTION /////// */}
          <div className="additional-user-info-container">
            <h3 className="my-children-title">
              {userData.full_name && userData.full_name + "'s Children"}
            </h3>
            <div className="my-children-container">
              {userData.children &&
                userData.children.map((child, key) => {
                  const { name, date_created, photo_url } = child;
                  const id = date_created.seconds.toString();
                  const childrenLength = userData.children.length;
                  const imageWH =
                    childrenLength === 1
                      ? "150px"
                      : childrenLength === 2
                      ? "120px"
                      : "100px";
                  const linkFontSize =
                    childrenLength === 1 ? "1.15rem" : "1rem";
                  return (
                    <div key={key}>
                      <Link
                        style={{
                          fontSize: linkFontSize,
                        }}
                        to={id}
                      >
                        <img
                          style={{
                            width: imageWH,
                            height: imageWH,
                          }}
                          src={photo_url}
                          alt={name}
                        />
                        {name}
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
