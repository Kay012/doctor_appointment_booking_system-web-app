import {db} from '../firebase/firebaseConfiguration'
import { collection, doc, getDocs, setDoc,getDocsFromServer,where, query, getDocFromServer  } from '@firebase/firestore'

export const BOOK_PAGE_STATUS ="BOOK_PAGE_STATUS"
export const FETCH_DOCTORS = "FETCH_DOCTORS"
export const FETCH_DOCTORS_BY_TOWN = "FETCH_DOCTORS_BY_TOWN"
export const FETCH_USER = "FETCH_USER"
export const CURRENT_USER = "CURRENT_USER"
export const SIGN_OUT_USER = "SIGN_OUT_USER"

export const bookStatuseHandler = (bookStatus) => {
    const bookStat = !bookStatus
    return async dispatch => {
        await dispatch({type:BOOK_PAGE_STATUS, bookStatus: bookStat})
    }
}

export const fetchDoctors = () => {
    return async dispatch => {
        const snapshot = query(collection(db, "users"),where("role","==", 1))
        const querySnapshot = await getDocsFromServer(snapshot)
        let doccs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data }
            });
        dispatch({type:FETCH_DOCTORS, doctors:doccs})
    }
    
}
export const fetchUser = (userId) => {
    return async (dispatch) => {
        try{
            const snapshot = query(doc(db, "users", userId))
            const querySnapshot = await getDocFromServer(snapshot)
            let data = querySnapshot.data()
            let user = {id:userId, ...data}
            dispatch({type:FETCH_USER, user:user})
        }catch(err){
            console.log(err)
        }
    }
    
    
}

export const SignOutUser = () =>{
    return async dispatch =>{
        dispatch({type: SIGN_OUT_USER})
    }
}

export const fetchDoctorsByTown = (search) => {

    return async dispatch =>{
        dispatch({type: FETCH_DOCTORS_BY_TOWN, search:search})
    }
        // console.log(search);
        // if(!search){
        //     setDoctors([])
        // }
        // else{
        //     const snapshot = query(collection(db, "users"),where("role","==", 1) ,where("town","==", search) )
        //     const querySnapshot = await getDocsFromServer(snapshot)
        //     let doccs = querySnapshot.docs.map(doc => {
        //         const data = doc.data();
        //         const id = doc.id;
        //         return { id, ...data }
        //         });
        // setDoctors(doccs);
        // }
        
    }

    // export const fetchCurrentUSer = (user) => {
    //     return async dispatch => {
    //         console.log("user")
    //         dispatch({type: CURRENT_USER, user:user})
    //     }
    // }