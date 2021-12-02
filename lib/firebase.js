import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_firebase_api_key,
    authDomain: process.env.NEXT_PUBLIC_firebase_auth_domain,
    projectId: process.env.NEXT_PUBLIC_firebase_project_id,
    storageBucket: process.env.NEXT_PUBLIC_firebase_storage_bucket,
    messagingSenderId: process.env.NEXT_PUBLIC_firebase_messaging_sender_id,
    appId: process.env.NEXT_PUBLIC_firebase_app_id,
    measurementId: process.env.NEXT_PUBLIC_firebase_measurement_id
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

export { db,storage,auth,createUserWithEmailAndPassword,signInWithEmailAndPassword };