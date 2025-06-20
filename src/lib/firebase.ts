import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpH2CkWlFzJ7dqed-Wms-3y4nHdbo_K3I",
    authDomain: "shortnews-admin.firebaseapp.com",
    projectId: "shortnews-admin",
    storageBucket: "shortnews-admin.firebasestorage.app",
    messagingSenderId: "448008497610",
    appId: "1:448008497610:web:5c8c880174993981f38733",
    measurementId: "G-0NJ6P925TP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 