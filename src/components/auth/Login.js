import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/firebaseConfiguration'
import { collection, doc, getDocs, setDoc,getDocFromServer } from '@firebase/firestore'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import * as Actions from '../../store/actions'
import './Login.css'
import { useDispatch } from 'react-redux'

const logUser ={
    email: "",
    password: ""
}
const Login = () => {
    const [user, setUser] = useState(logUser)
    const dispatch = useDispatch()

    const onInputChange = (e) =>{
        e.preventDefault()
        const {name, value} = e.target;
        setUser({...user, [name]: value})

    }

    const onSignIn = async (e) =>{
        e.preventDefault()
        const auth = getAuth()
        // const {email, password} = e.target
        // console.log(email)
        try{
            await signInWithEmailAndPassword(auth,user.email, user.password)

            await dispatch( Actions.fetchUser(auth.currentUser.uid))
                // console.log({id, ...userData })
                window.location.href='/'
            // const docRef = doc(db, "users", auth.currentUser.uid)
            // const docSnap = await getDocFromServer(docRef)
            
            // if (docSnap.exists()) {
            //     const id = docSnap.id

            //     const userData = docSnap.data()
            //     console.log("Document data:", docSnap.data());
            //     if(docSnap.data().role ===0){
            //         console.log("Client")
            //     }
            //     else if(docSnap.data().role ===1){
            //         console.log("You a Dr")
            //     }
            //     else if(docSnap.data().role ===3){
            //         console.log("You an Admin")
            //     }
            //     await Actions.fetchCurrentUSer({id, ...userData })
            //     console.log({id, ...userData })
            //     window.location.href='/'
            //   } else {
            //     // doc.data() will be undefined in this case
            //     console.log("No such user!");
            //   }

        }catch(err){
            console.log(err)
        }
        
    }
    return (
        <div className='login-page'>
            <form onSubmit={onSignIn}>
                <h2>Login</h2>
                <input type='email' name='email' required
                placeholder='Email' autoComplete='on' onChange={onInputChange}  />

                <input type='password' name='password' required
                placeholder='Password' onChange={onInputChange}  
                 />
                

                <div className='row'>
                    <button type='submit'>Login</button>
                    <Link to='/register'>Register</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
