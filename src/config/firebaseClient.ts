import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu19bx5fdgknpSPCCsBuF562fUEXiNUqs",
  authDomain: "my-next-app-93384.firebaseapp.com",
  projectId: "my-next-app-93384",
  storageBucket: "my-next-app-93384.firebasestorage.app",
  messagingSenderId: "621930231526",
  appId: "1:621930231526:web:ebf3fd210360f24ebb2d27",
  measurementId: "G-PV59YS669H"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db = getFirestore(app);   
export const googleProvider=new GoogleAuthProvider();
export const storage=getStorage(app);