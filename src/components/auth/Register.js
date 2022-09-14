import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { db } from '../../firebase/firebaseConfiguration'
import { collection, doc, getDocs, setDoc } from '@firebase/firestore'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'

const initialUser = {
    email: "",
    username: "",
    password: "",
    stAddress: "",
    building: "",
    suburb: "",
    town: "",
    province: "", 
    postalCode: 0

}
const Register = () => {
    const auth = getAuth()
    const [user, setUser] = useState(initialUser)
    const usersCollectionRef = collection(db, 'users')
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getUsers = async() => {
            try{
                const data = await getDocs(usersCollectionRef)
                setUsers(data.docs.map((doc) => ({...doc.data,  id:doc.id})))
                // console.log(users)
            }catch(err){
                console.log(err)
            }
            
        }
        getUsers()
    }, [])

    const onInputChange = (e) =>{
        e.preventDefault()
        const {name, value} = e.target;
        setUser({...user, [name]: value})

    }

    const register = async(e) => {
        e.preventDefault()
        // console.log(user)
        try{
            try{
                const newUser = await createUserWithEmailAndPassword(auth, user.email, user.password)
                await updateProfile(auth.currentUser, {displayName:user.username})
                console.log(newUser)
            }catch(err){
                console.log(err)
            }

            try{
                const docRef = doc(db, "users", auth.currentUser.uid)
                await setDoc(docRef, {
                    email: user.email, 
                    username: user.username.toLowerCase(), 
                    role:0,
                    street_address : user.stAddress,
                    building: user.building,
                    suburb : user.suburb,
                    town: user.town,
                    province: user.province,
                    postal_code: user.postalCode,
                    profession: "",
                    opens: "",
                    closes:""
                })
        // console.log(newUser.id)
            }catch(err){
                console.log(err)
            }
            
             
        // console.log(newUser)
        }catch(err){
            console.log(err)
        }
        

        // await addDoc(usersCollectionRef, {email: user.email, name: user.name, lastname:  user.lastname})
    }
    return (
        <div className='login-page'>
            <form  onSubmit={register}>
                <h2>Register</h2>
            <input type='text' name='username' required
                placeholder='Name' autoComplete='on' onChange={onInputChange}/>

                <input type='email' name='email' required
                placeholder='Email' autoComplete='on' onChange={onInputChange}/>

                <input type='password' name='password' required
                placeholder='Password' onChange={onInputChange}/>

                <div className='row'>
                    <button type='submit'>Register</button>
                    <Link to='/login'>Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
