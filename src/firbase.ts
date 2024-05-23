// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAS1XrtZOKQ_h23FrC_sso2cMRlpL5PpNg",
    authDomain: "blog-ea5da.firebaseapp.com",
    projectId: "blog-ea5da",
    storageBucket: "blog-ea5da.appspot.com",
    messagingSenderId: "98381924276",
    appId: "1:98381924276:web:b0e1609547da61cce194e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage();


export {db, auth, storage}

export default app;