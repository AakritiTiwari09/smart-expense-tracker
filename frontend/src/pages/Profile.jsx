import { Link } from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

function Profile() {

  const [profileName,
    setProfileName] =
    useState("");

  const [profileEmail,
    setProfileEmail] =
    useState("");

  const [profilePhone,
    setProfilePhone] =
    useState("");

  const [profileImage,
    setProfileImage] =
    useState("");

  // LOAD DATA

  useEffect(() => {

    setProfileName(
      localStorage.getItem(
        "profileName"
      ) || ""
    );

    setProfileEmail(
      localStorage.getItem(
        "profileEmail"
      ) || ""
    );

    setProfilePhone(
      localStorage.getItem(
        "profilePhone"
      ) || ""
    );

    setProfileImage(
      localStorage.getItem(
        "profileImage"
      ) || ""
    );

  }, []);

  // SAVE PROFILE

  const saveProfile = () => {

  try {

    localStorage.setItem(
      "profileName",
      profileName
    );

    localStorage.setItem(
      "profileEmail",
      profileEmail
    );

    localStorage.setItem(
      "profilePhone",
      profilePhone
    );

    localStorage.setItem(
      "profileImage",
      profileImage
    );

    alert(
      "Profile Updated Successfully ✅"
    );

  }

  catch(error){

    alert(
      "Image too large. Please choose a smaller image."
    );
    window.location.reload();

    console.log(error);

  }

};

  return (

    <div className="page">

      <h1>
        My Profile
      </h1>

      <Link
        to="/"
        className="back-btn"
      >
        🏠 Dashboard
      </Link>

      <br /><br />

      {

        profileImage && (

          <img
            src={profileImage}
            alt="profile"

            style={{
              width:"120px",
              height:"120px",
              borderRadius:"50%",
              objectFit:"cover",
              border:"3px solid #2563eb"
            }}
          />

        )

      }

      <br /><br />

      <input
        type="text"
        placeholder="Name"
        value={profileName}
        onChange={(e) =>
          setProfileName(
            e.target.value
          )
        }
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={profileEmail}
        onChange={(e) =>
          setProfileEmail(
            e.target.value
          )
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Phone"
        value={profilePhone}
        onChange={(e) =>
          setProfilePhone(
            e.target.value
          )
        }
      />

      <br /><br />

      <input
        type="file"

        onChange={(e) => {

          const file =
            e.target.files[0];

          if (file) {

            const reader =
              new FileReader();

            reader.onloadend =
              () => {

                setProfileImage(
                  reader.result
                );

              };

            reader.readAsDataURL(
              file
            );

          }

        }}
      />

      <br /><br />

      <button
        onClick={saveProfile}
      >
        Save Profile
      </button>

    </div>

  );
}

export default Profile;