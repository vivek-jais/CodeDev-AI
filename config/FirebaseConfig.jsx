// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  initializeAuth, getReactNativePersistence, getAuth} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbu7CCFwIgdq9BgwIi1FHSaiInH-58I48",
  authDomain: "projects-40711.firebaseapp.com",
  projectId: "projects-40711",
  storageBucket: "projects-40711.firebasestorage.app",
  messagingSenderId: "637060224478",
  appId: "1:637060224478:web:a9086d0c0ee9b822e3f94f",
  measurementId: "G-DHLTTP2LG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = initializeAuth(app,{
//     persistence:getReactNativePersistence(ReactNativeAsyncStorage)
// })

export let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app); // No persistence setup for web
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const db = getFirestore(app);
// const analytics = getAnalytics(app);