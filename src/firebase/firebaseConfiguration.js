import * as firebase from 'firebase/app';
import {getFirestore} from '@firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGE_SENDER_ID,APP_ID, MEASUREMENT_ID} from '../env_variables/secrets'


// import ScrollToTop from './components/ScrollToTop';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};



// if(firebase.getApps.length === 0){
const app = firebase.initializeApp(firebaseConfig)  

export const db = getFirestore(app)

export const auth = firebaseAuth;
// }
