import logo from './logo.svg';
import './App.css';
import Header from './components/headers/Header';
import Home from './components/home/Home';
import ViewDr from './components/doctorpage/ViewDr';
import {BrowserRouter as Router} from 'react-router-dom'
import Mainpages from './components/Mainpages';
import { getAuth } from '@firebase/auth';

import {createStore, applyMiddleware, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { bookStatusReducer, fetchCurrentUserReducer, fetchDoctorsReducer } from './store/reducer';

import { useDispatch, useSelector } from 'react-redux'

import * as Actions from './store/actions'
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc,getDocFromServer } from '@firebase/firestore'
import { db } from './firebase/firebaseConfiguration';
import Loading from './components/loading/Loading';
import MainApp from './MainApp';
const rootReducer = combineReducers({
    bookStatus: bookStatusReducer,
    doctorsList: fetchDoctorsReducer,
    currentUser: fetchCurrentUserReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))


function App() {
  
  return (
    <Provider store={store}>
      <MainApp/>
    </Provider>
    
  );
}

export default App;

// auth.onAuthStateChanged((user) => {
        // const docRef = doc(db, "users", user.uid)
        //     const docSnap = await getDocFromServer(docRef)
            
        //     if (docSnap.exists()) {
        //         const id = docSnap.id

        //         const userData = docSnap.data()
                // console.log("Document data:", docSnap.data());
              // try{
                // setUserId(user.uid)
                // console.log("changerd", user.uid)
              // }catch(err){
              //   console.log(err)
              // }
        
                // console.log({id, ...userData })
                // window.location.href='/'
            //   } else {
            //     // doc.data() will be undefined in this case
            //     console.log("No such user!");
            //   }
            // }
      // })