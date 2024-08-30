import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase/config";
import { toast } from "sonner";

export const getloginUserData = createAsyncThunk(
  "auth/getloginUserData",
  async (userId, thunkAPI) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.status === "accepted") {
          toast.success("Your request has been accepted", {
            style: {
              color: "green",
            },
          });
          return userData; // Return the user data if the status is approved
        } else if (userData.status === "rejected") {
          toast.error("Your request has been declined", {
            style: {
              color: "red",
            },
          });
        } else if (userData.status === "pending") {
          toast.error("Your request is still pending", {
            style: {
              color: "red",
            },
          });
        } else {
          throw new Error("User status is invalid or not set.");
        }
      } else {
        throw new Error("User does not exist in Firestore.");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      try {
        const userData = await thunkAPI
          .dispatch(getloginUserData(user.uid))
          .unwrap();
        return userData;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserLocal = () => {
  try {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user !== null) {
        return user;
      } else {
        return null;
      }
    }
  } catch (err) {
    console.log("Error getting user:", err);
    return null;
  }
};

const initialState = {
  user: {
    // name: "Deepak",
    // role: "vendor",
    // // role: "admin",
  },
  isLoading: false,
  error: null,
};

export const loggedInUserSlice = createSlice({
  name: "loggedInUser",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;
