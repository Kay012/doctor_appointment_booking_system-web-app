import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import Img1 from '../../assets/images/img2.jpg'

import './Profile.css'
import CurrentBooking from './CurrentBooking'
import { useSelector } from 'react-redux'
import { collection, query, where, getDocsFromServer} from '@firebase/firestore' 
import { db } from '../../firebase/firebaseConfiguration'
import Loading from '../loading/Loading'
const Profile = () => {
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    const doctors = useSelector(state => state.doctorsList.doctors)
    const [userBookings, setUserBookings] = useState([])
    const [activeBookings, setActiveBookings] = useState([])
    const [bookingsHistory, setBookingsHistory] = useState([])
    const[callback, setCallback] = useState(false)
    
    useEffect(() => {
        const fetchBookings = async()=>{
            console.log("geeting")
            let list = []
            if(currentUser === undefined) return;
            console.log(currentUser)
            setCallback(true)
            if(currentUser.role === 0){
            
                const colRef = query(collection(db,"bookings"), where("client_Id", "==", currentUser.id))
                const colRefSnapshot = await getDocsFromServer(colRef)

                const docs = colRefSnapshot.docs.map(doc => {
                    const id = doc.id;
                    return {id}
                })
                // console.log(docs)
                docs.forEach(async(doc) => {
                    const snapshot = query(collection(db, "bookings", doc.id, "clientBookings"))
                    const querySnapshot = await getDocsFromServer(snapshot)

                    let doccs = querySnapshot.docs.map(dot => {
                        const id = dot.id;
                        const data = dot.data()
                        list.push({id, ...data})
                        setUserBookings([...list])
                        // return {id, ...data}
                    })
                    
                });
            }
            else if(currentUser.role === 1){

                console.log("fklip")
                const colRef = query(collection(db,"bookings"), where("doctor_Id", "==", currentUser.id))
                const colRefSnapshot = await getDocsFromServer(colRef)

                const docs = colRefSnapshot.docs.map(doc => {
                    const id = doc.id;
                    return {id}
                })
                console.log(docs)
                docs.forEach(async(doc) => {
                    const snapshot = query(collection(db, "bookings", doc.id, "doctorBookings"))
                    const querySnapshot = await getDocsFromServer(snapshot)

                    let doccs = querySnapshot.docs.map(dot => {
                        const id = dot.id;
                        const data = dot.data()
                        list.push({id, ...data})
                        setUserBookings([...list])
                        // return {id, ...data}
                    })
                    
                });
            }
            
            const actives = userBookings.filter(appointment => new Date(appointment.date) > new Date() )
            const history = userBookings.filter(appointment => new Date(appointment.date) < new Date() )
            setActiveBookings([...actives])
            setBookingsHistory([...history])
            
        }
        fetchBookings()
        setCallback(false)
        
    }, [currentUser])
    
    

    // const displayBooking = (id, bookin) => {
        
    //     const val = doctors.fil(doctor => doctor.id === id)
    //     console.log(val)
    //     return (<CurrentBooking key={id} doctor={val[0]} booking={bookin}/>)
    // }
    console.log(bookingsHistory)
    if(callback) return(<div><Loading/></div>)

    return (
        <div>
            {currentUser.role === 0 && 
            <div className="profile">
                <div className="profile__image">
                    <img src={Img1} alt="" />
                </div>
                <div className="profile__name">
                    <span style={{fontWeight:'bold'}}>{currentUser.username}</span>
                    <span style={{fontWeight:'bold'}}>{currentUser.email}</span>
                    <span style={{fontWeight:'bold'}}>0712345678</span>
                </div>
            </div>
            }
            {
                activeBookings.length > 0 &&
                <div className="current__bookings">
                    <h4>Active Bookings</h4>
                    {activeBookings.map(bookin =>(
                        <CurrentBooking key={bookin.id} booking={bookin} role={currentUser.role}/>
                    ))}
                </div>
            }
            
            {
                bookingsHistory.length > 0 &&
                <div className="booking__history">
                    <h4>Booking History</h4>
                    {bookingsHistory.map(bookin =>(
                        <CurrentBooking key={bookin.id} booking={bookin} role={currentUser.role}/>
                    ))}
                </div>
            }
            
                
                
                
            
        </div>
    )
}

export default Profile
