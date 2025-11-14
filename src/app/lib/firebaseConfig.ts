// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const registerFirebaseUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
};

export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
};

export const logout = () => {
    return auth.signOut();
}

export const resetPasswordEmail = (email: string) => {
  return sendPasswordResetEmail(auth, email);
}

//Google Login
export const loginGoogle = () => {
    return signInWithPopup(auth, provider);
}
