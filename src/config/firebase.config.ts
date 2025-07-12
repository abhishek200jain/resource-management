import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaXthKNLV6FKwOsH9D_nnAVmpySUkzr4U",
  authDomain: "resource-management-syst-f40c8.firebaseapp.com",
  projectId: "resource-management-syst-f40c8",
  storageBucket: "resource-management-syst-f40c8.firebasestorage.app",
  messagingSenderId: "986763454302",
  appId: "1:986763454302:web:e96e2bd865a80ae3d991cf",
  measurementId: "G-P20N5RQXNT"
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase
// let app;
// try {
//   app = initializeApp(firebaseConfig);
//   console.log('Firebase initialized successfully');
// } catch (error) {
//   console.error('Firebase initialization failed:', error);
//   throw error;
// }

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
export default app; 