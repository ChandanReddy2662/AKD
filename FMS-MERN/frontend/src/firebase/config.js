
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "add apikey here",
    authDomain: "csproconnect-f40a5.firebaseapp.com",
    projectId: "csproconnect-f40a5",
    storageBucket: "csproconnect-f40a5.appspot.com",
    messagingSenderId: "579282644402",
    appId: "1:579282644402:web:adab4e2fa6deb4d6b1c8ab",
    measurementId: "G-7LPWZZ7WTB"
  }
// const firebaseConfig = {
//   apiKey: "AIzaSyDtLN0des9QSYiu166Z_tLuNqPjgWHJxP8",
//   authDomain: "fims-7ee15.firebaseapp.com",
//   projectId: "fims-7ee15",
//   storageBucket: "fims-7ee15.firebasestorage.app",
//   messagingSenderId: "972395947581",
//   appId: "1:972395947581:web:c3a874f2a4160b1082ac54",
//   measurementId: "G-PSTVXS6LYJ"
// };

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
