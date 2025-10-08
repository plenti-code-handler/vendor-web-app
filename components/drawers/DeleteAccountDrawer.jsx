// "use client";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { useDispatch, useSelector } from "react-redux";
// import { setOpenDrawer } from "../../redux/slices/deleteAccountSlice";
// import { crossIconSvg, deleteUserSvg } from "../../svgs";
// import PasswordField from "./components/PasswordField";
// import { useState } from "react";
// import {
//   deleteUser,
//   EmailAuthProvider,
//   getAuth,
//   reauthenticateWithCredential,
// } from "firebase/auth";
// import { auth, db } from "../../app/firebase/config";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import {
//   doc,
//   getDocs,
//   query,
//   collection,
//   where,
//   deleteDoc,
//   getDoc,
// } from "firebase/firestore";

// const DeleteAccountDrawer = () => {
//   const dispatch = useDispatch();
//   const open = useSelector((state) => state.deleteAccount.drawerOpen);

//   const handleClose = () => {
//     dispatch(setOpenDrawer(false));
//   };

//   const router = useRouter();

//   const [password, setPassword] = useState("");

//   const auth = getAuth();
//   const user = auth.currentUser;

//   const handlePasswordDelete = async (password) => {
//     console.log(password);
//     if (!user) {
//       setError("No user is logged in.");
//       return;
//     }
//     const email = user.email;
//     try {
//       // Step 1: Re-authenticate the user
//       dispatch(loginUser({ email, password })).unwrap();

//       // Step 2: Fetch the user's Firestore document
//       const userDocRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (!userDoc.exists()) {
//         toast.error("User record not found.");
//         return;
//       }

//       const userData = userDoc.data();
//       const role = userData.role;

//       // Step 3: Check if the user is a vendor
//       if (role === "vendor") {
//         // Delete the vendor from Firebase Authentication
//         console.log("User re-authenticated successfully.");
//         await auth.currentUser.delete();

//         toast.success("Vendor account deleted successfully.");

//         // Delete the user's record from Firestore
//         await deleteDoc(userDocRef);

//         // Step 4: Delete all bags associated with the vendor
//         const bagQuery = query(
//           collection(db, "bags"),
//           where("resuid", "==", user.uid)
//         );
//         const bagSnapshot = await getDocs(bagQuery);

//         if (!bagSnapshot.empty) {
//           bagSnapshot.forEach(async (bagDoc) => {
//             await deleteDoc(bagDoc.ref); // Directly delete each bag document
//           });
//         }

//         toast.success("All associated bags deleted successfully.");
//       } else {
//         toast.error("Only vendors can delete their accounts.");
//       }

//       // Step 5: Sign out the user, close the drawer, dispatch logout, and navigate to the homepage.
//       dispatch(setOpenDrawer(false));
//       await auth.signOut();
//       dispatch(logoutUser());
//       router.push("/");
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       toast.error("Incorrect password or an error occurred.");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} className="relative z-999999">
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
//       />
//       <div className="fixed inset-0 overflow-hidden rounded-md">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
//             <DialogPanel
//               transition
//               className="pointer-events-auto relative lg:w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
//             >
//               <div className="flex h-full flex-col overflow-y-scroll bg-white py-5 shadow-xl">
//                 <DialogTitle className="flex px-4 sm:px-6 justify-between ">
//                   <p className="text-blackFour font-semibold text-lg">
//                     Delete Account
//                   </p>
//                   <button
//                     className="p-2 hover:bg-gray-200 rounded"
//                     onClick={() => handleClose()}
//                   >
//                     {crossIconSvg}
//                   </button>
//                 </DialogTitle>
//                 <hr className="my-3 w-[90%] border-gray-300 ml-8" />
//                 <div className="relative mt-3 pb-3 flex-1 px-4 sm:px-6 space-y-4">
//                   <div className="flex flex-col items-center mt-5 gap-2">
//                     {deleteUserSvg}
//                     <p className="text-blackFour font-semibold text-[22px]">
//                       Delete Account
//                     </p>
//                     <p className="font-md text-sm text-gray-800 text-center">
//                       Are you sure you want to delete your account?
//                     </p>
//                     <p className="font-md text-sm text-redOne text-center">
//                       Your account will be deleted permanently.
//                     </p>
//                   </div>
//                   <div className="flex flex-col space-y-2 pt-3">
//                     <p className="text-blackFour font-semibold text-[15px]">
//                       Enter Your Password
//                     </p>
//                     <PasswordField value={password} onChange={setPassword} />
//                   </div>

//                   <div className="flex gap-5 pt-5">
//                     <button
//                       onClick={() => setPassword("")}
//                       className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 w-[100%]"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handlePasswordDelete}
//                       className="flex justify-center bg-redOne text-white font-md py-2  rounded hover:bg-redOne-600 gap-2 w-[100%]"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default DeleteAccountDrawer;
