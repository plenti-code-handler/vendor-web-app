"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import {
  getUserLocal,
  logoutUser,
} from "../../../../redux/slices/loggedInUserSlice";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../../firebase/config";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword as updateFirebasePassword,
} from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { pencilSvgProfile } from "../../../../svgs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Page = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [preview, setPreview] = useState(""); // State for image preview
  const [profileImage, setProfileImage] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const [user, setUser] = useState({});

  const authenticatedUser = auth.currentUser;

  const router = useRouter();

  useEffect(() => {
    const localUser = getUserLocal();
    setUser(localUser);
  }, []);

  useEffect(() => {
    dispatch(setActivePage("Profile"));
  }, [dispatch]);

  useEffect(() => {
    if (user && user.uid) {
      const fetchUserData = async () => {
        // Retrieve user id from localStorage
        const { uid } = user; // Extract uid from localStorage

        try {
          // Fetch the user data from Firestore
          const userDoc = await getDoc(doc(db, "users", uid)); // Assuming 'users' collection

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Update state with the fetched user data
            setPreview(userData.imageUrl);
            // setPreview(userData.imageUrl);
            setEmail(userData.email);
            setName(userData.name || "");
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
    } else {
      console.error("user uid not available");
    }
  }, [user]); // Runs once on initial render

  const reauthenticateUsers = async () => {
    if (!user) {
      return;
    }

    const credential = EmailAuthProvider.credential(
      authenticatedUser.email,
      oldPassword
    );

    try {
      //   Update Name in collection

      if (oldPassword === "") {
        const userDocRef = doc(db, "users", user.uid); // Assuming the user document ID is the user's UID
        await updateDoc(userDocRef, {
          name: name,
        });
        toast.success("Name Updated Successfully!");
        return;
      } else {
        await reauthenticateWithCredential(authenticatedUser, credential);
      }

      // Password is correct, proceed to the next step
      if (newPassword === confirmNewPassword) {
        try {
          // Update password in Firebase Authentication
          await updateFirebasePassword(authenticatedUser, newPassword);
          console.log("Password updated successfully in Firebase Auth.");

          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");

          toast.success("Password updated successfully in Firestore.");
          await auth.signOut();
          dispatch(logoutUser());
          router.push("/");
        } catch (error) {
          console.error("Error updating password:", error);
        }
      } else {
        toast.error("Passwords do not match");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearChanges = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setProfileImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create a preview URL

      // Reference to Firebase Storage using the selected file's name
      const storageRef = ref(storage, `profile_images/${selectedFile.name}`);

      // Create a file upload task
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      console.log(uploadTask);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
        },
        async () => {
          // Handle successful uploads
          try {
            // Get the download URL after the file is uploaded
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const myCollection = collection(db, "users");

            // Define the document reference
            const myDocRef = doc(myCollection, user.uid);

            // Add or update the document with the image URL
            await updateDoc(myDocRef, {
              imageUrl: downloadURL,
            });

            toast.success("File Uploaded Successfully!");
          } catch (error) {
            console.error("Error saving document: ", error);
          }
        }
      );
    }
  };

  return (
    <div className="flex-grow p-5">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex flex-col gap-5 border min-w-full md:min-w-[549px] rounded-[28px] p-10">
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="relative w-[90.95px] h-[90.95px]">
              <div className="bg-[#C2C2C2]/20 rounded-full items-center justify-center flex overflow-hidden w-full h-full">
                <img
                  src={preview || "/User.png"}
                  alt="Profile"
                  className="object-cover rounded-full h-full"
                />
              </div>
              <label
                htmlFor="upload-button"
                className="absolute bottom-0 right-0 transform translate-x-1/5 translate-y-1/5 bg-secondary w-[24px] h-[24px] items-center justify-center flex rounded-full cursor-pointer"
              >
                <input
                  id="upload-button"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-white">{pencilSvgProfile}</span>
              </label>
            </div>
            <p className="text-paragraph">{email}</p>
          </div>
          <input
            className="flex-grow text-p2 p-3 bg-whiteOne rounded-[6px] bg-[#F9F9F9] outline-none"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="flex-grow text-p2 p-3 bg-whiteOne rounded-[6px] bg-[#F9F9F9] outline-none"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            className="flex-grow text-p2 p-3 bg-whiteOne rounded-[6px] bg-[#F9F9F9] outline-none"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="flex-grow text-p2 p-3 bg-whiteOne rounded-[6px] bg-[#F9F9F9] outline-none"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div className="flex gap-5">
            <button
              onClick={clearChanges}
              className="border flex-grow p-3 rounded-[8px] text-grayText"
            >
              Discard Changes
            </button>
            <button
              onClick={reauthenticateUsers}
              className="rounded-[8px] p-3 flex-grow bg-pinkBgDark text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
