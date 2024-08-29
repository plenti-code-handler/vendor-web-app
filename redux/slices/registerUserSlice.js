import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../app/firebase/config";
import { collection, addDoc, updateDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../app/firebase/config";
import { formatDateTime } from "../../utility/date";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, name, loc, desc, img, point }, thunkAPI) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const placeholderImage =
        "https://firebasestorage.googleapis.com/v0/b/foodie-finder-ee1d8.appspot.com/o/person.png?alt=media&token=3d046313-6334-44cd-abf5-1345111c9cee";

      let userData = {};

      if (img === placeholderImage) {
        userData = {
          email,
          imageUrl: img,
          name,
          loc,
          desc,
          role: "vendor",
          pass: password,
          bags: 0,
          rating: 0,
          status: false,
          point,
          otp: 1234,
          categories: [],
          joinedAt: formatDateTime(new Date()),
          uid: user.uid,
        };

        const myCollection = collection(db, "users");

        // Define the document reference
        const myDocRef = doc(myCollection, user.uid);

        // Add or update the document
        await setDoc(myDocRef, userData);

        return;
      }

      userData = {
        email,
        name,
        loc,
        desc,
        role: "vendor", // Assign role as "vendor"
        pass: password, // Caution: Storing passwords in Firestore is not recommended
        bags: 0,
        rating: 0,
        status: false,
        categories: [],
        joinedAt: formatDateTime(new Date()),
        point,
        otp: 1234, // Assuming OTP is fixed; otherwise, generate it dynamically
      };

      // Prepare user data to be stored in Firestore

      const storageRef = ref(storage, `profile_images/${img.name}`);

      const uploadTask = uploadBytesResumable(storageRef, img);

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
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const myCollection = collection(db, "users");
            const myDocumentData = {
              ...userData,
              uid: user.uid,
              imageUrl: downloadURL,
            };

            // Define the document reference
            const myDocRef = doc(myCollection, user.uid);

            // Add or update the document
            await setDoc(myDocRef, myDocumentData);
          } catch (error) {
            console.error("Error saving document: ", error);
          }
        }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Handle errors
    }
  }
);

const initialState = {
  email: "",
  password: "",
  otp: "",
  profile: {
    img: "",
    name: "",
    loc: "",
    description: "",
  },
};

export const registerUserSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterEmail: (state, action) => {
      state.email = action.payload;
    },
    setRegisterPassword: (state, action) => {
      state.password = action.payload;
    },
    setOtpCode: (state, action) => {
      state.otp = action.payload;
    },
    setProfile: {
      reducer: (state, action) => {
        state.profile.img = action.payload.profileImage;
        state.profile.name = action.payload.businessName;
        state.profile.loc = action.payload.location;
        state.profile.description = action.payload.description;
      },
      prepare: (profileImage, businessName, location, description) => {
        return {
          payload: {
            profileImage,
            businessName,
            location,
            description,
          },
        };
      },
    },
  },
});

export const { setRegisterEmail, setOtpCode, setRegisterPassword, setProfile } =
  registerUserSlice.actions;
export default registerUserSlice.reducer;
