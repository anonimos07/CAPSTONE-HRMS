
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAb-g1XB-JR4FedukY3F9ZxKOItwAQxDvs",
  authDomain: "hrms-aff30.firebaseapp.com",
  projectId: "hrms-aff30",
  storageBucket: "hrms-aff30.firebasestorage.app",
  messagingSenderId: "267301667531",
  appId: "1:267301667531:web:eebbd6325879413a07514e",
  measurementId: "G-FZ2QS22KVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);