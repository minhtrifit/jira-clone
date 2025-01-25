import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
