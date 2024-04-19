import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
	PUBLIC_APIKEY,
	PUBLIC_AUTH_DOMAIN,
	PUBLIC_PROJECT_ID,
	PUBLIC_STORAGE_BUCKET,
	PUBLIC_MESSAGING_SENDER_ID,
	PUBLIC_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_APIKEY,
	authDomain: PUBLIC_AUTH_DOMAIN,
	projectId: PUBLIC_PROJECT_ID,
	storageBucket: PUBLIC_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_MESSAGING_SENDER_ID,
	appId: PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);