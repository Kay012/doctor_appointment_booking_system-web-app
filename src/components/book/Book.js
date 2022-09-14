import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Book.css'
import * as Actions from '../../store/actions'
import { db } from '../../firebase/firebaseConfiguration'
import {collection, query, getDocsFromServer, where, addDoc, deleteDoc, doc, setDoc} from '@firebase/firestore'
import { getAuth } from '@firebase/auth'
const Book = (props) => {
    const auth = getAuth()
    const bookStatus = useSelector(state => state.bookStatus.bookStatus)
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    const dispatch = useDispatch()
    const [slots, setSlots] = useState([])
    const [existingBookings, setExistingBookings] = useState([])
    const [existingBookingsLength, setExistingBookingsLength] = useState(0)
    const [slotsDate, setSlotsDate] = useState(new Date().toDateString())

    const handleClose = async (e) => {
        e.preventDefault();
        await dispatch(Actions.bookStatuseHandler(bookStatus))
    }

    useEffect(() => {
        const fetchSlots = async() => {
            
            try{
                let preSlosts = []
                // if(params){
                    const snapshot = query(collection(db, "slots"), where("doctor_Id", "==", props.doctorId))
                    const querySnapshot = await getDocsFromServer(snapshot)
                    

                    let docs = querySnapshot.docs.map((doc) => {
                        const id = doc.id
                        return {id}
                    })
                    docs.forEach(async doc => {
                        const snap = query(collection(db, "slots", doc.id, "doctorSlots"))
                        const querySnap = await getDocsFromServer(snap)
                        let slots = querySnap.docs.map((docu) => {
                            const id = docu.id
                            const data = docu.data()
                            preSlosts.push({id, ...data})
                            setSlots([...preSlosts])
                        })

                    })
                    
                // }
            }catch(err){
                console.log(err)
            }
        }

        const selectedDateHandler = async() => {
            // e.preventDefault()
            
            let preBookings = []
            setSlotsDate(new Date())
            const snapshot = query(collection(db, "bookings"), where("doctor_Id","==", props.doctorId), where("date", "==", new Date().toDateString()))
    
            const querySnapshot = await getDocsFromServer(snapshot)
            
    
            let docs = querySnapshot.docs.map((doc) => {
                const id = doc.id
                return {id}
            })
            docs.forEach(async doc => {
                const snap = query(collection(db, "bookings", doc.id, "doctorBookings"))
                const querySnap = await getDocsFromServer(snap)
                let slots = querySnap.docs.map((docu) => {
                    const id = docu.id
                    const data = docu.data()
                    preBookings.push({id, ...data})
                    setExistingBookings([...preBookings])
                })
    
            })
            setExistingBookingsLength(preBookings.length)
        }
        fetchSlots()
        selectedDateHandler()
    }, [])

    const selectedDateHandler = async(e) => {
        e.preventDefault()
        let preBookings = []
        setSlotsDate(new Date(e.target.value).toDateString())
        const snapshot = query(collection(db, "bookings"), where("doctor_Id","==", props.doctorId), where("date", "==", new Date(e.target.value).toDateString()))

        const querySnapshot = await getDocsFromServer(snapshot)
        
        // console.log(new Date(e.target.value).toDateString())

        let docs = querySnapshot.docs.map((doc) => {
            const id = doc.id
            // console.log(id)
            return {id}
        })
        docs.forEach(async doc => {
            const snap = query(collection(db, "bookings", doc.id, "doctorBookings"))
            const querySnap = await getDocsFromServer(snap)
            let slots = querySnap.docs.map((docu) => {
                const id = docu.id
                const data = docu.data()
                preBookings.push({id, ...data})
                setExistingBookings([...preBookings]) 
            })

        })
        setExistingBookingsLength(preBookings.length)
    }

    const submitAppointement = async(time) => {
        const confirmBooking = window.confirm("Confirm Appointment")
        if (!confirmBooking)return

        //writing to doctor bookings
        try{
            const colRef = query(collection(db, "bookings"), where("date", "==", slotsDate), where("doctor_Id", "==", props.doctorId))
            const res =await getDocsFromServer(colRef)
            
            let colExist = [];
            if(res.docs.length > 0){
                console.log("arric")
                colExist= res.docs.map(doc => {
                let id =doc.id
                return id
                })
            }
            // console.log(colExist[0], "ëish", slotsDate)
            if(colExist.length > 0){
                console.log("here")
                const drBookingRef = query(collection(db, "bookings", colExist[0], "doctorBookings"))
                const drDocRef1 = await addDoc(drBookingRef, {
                doctor_Id: props.doctorId,
                client_Id: auth.currentUser.uid,
                date: slotsDate,
                time: time,
                collection_Id: colExist[0],
                doctor_Name: props.doctorName,
                client_Name: currentUser.username,
                doctor_Profession: props.doctorProfession,
                client_Email: currentUser.email,
                client_Cellphone: currentUser.cellphone
                })

                const clientBookingRef = query(doc(db, "bookings", colExist[0], "clientBookings", drDocRef1.id))
                await setDoc(clientBookingRef, {
                doctor_Id: props.doctorId,
                client_Id: auth.currentUser.uid,
                date: slotsDate,
                time: time,
                collection_Id: colExist[0],
                doctor_Name: props.doctorName,
                client_Name: currentUser.username,
                doctor_Profession: props.doctorProfession,
                client_Email: currentUser.email,
                client_Cellphone: currentUser.cellphone

                })

            alert("success")
            }
            else{
                const docRef = query(collection(db, "bookings"))
                const docum = await addDoc(docRef, {
                    doctor_Id: props.doctorId,
                    client_Id: auth.currentUser.uid,
                    date: slotsDate
                })

                const drBookingRef = query(collection(db, "bookings", docum.id, "doctorBookings"))
                const drDocRef2 = await addDoc(drBookingRef, {
                    doctor_Id: props.doctorId,
                    client_Id: auth.currentUser.uid,
                    date: slotsDate,
                    time: time,
                    collection_Id: docum.id,
                    doctor_Name: props.doctorName,
                    client_Name: currentUser.username,
                    doctor_Profession: props.doctorProfession,
                    client_Email: currentUser.email,
                    client_Cellphone: currentUser.cellphone

                })

                const clientBookingRef = query(doc(db, "bookings", docum.id, "clientBookings", drDocRef2.id))
                await setDoc(clientBookingRef, {
                    doctor_Id: props.doctorId,
                    client_Id: auth.currentUser.uid,
                    date: slotsDate,
                    time: time,
                    collection_Id: docum.id,
                    doctor_Name: props.doctorName,
                    client_Name: currentUser.username,
                    doctor_Profession: props.doctorProfession,
                    client_Email: currentUser.email,
                    client_Cellphone: currentUser?.cellphone
                })

                alert("success")
            }
        }catch(err){
            console.log(err)
        }
    }


    const cancelAppointmentHandler = async(id, collection_id) => {
        console.log(existingBookings.length)
        const bookingRef = query(doc(db, "bookings", collection_id, "doctorBookings", id ))
        await deleteDoc(bookingRef)

        if(existingBookings.length <= 1){
            const higherRef = query(doc(db, "bookings", collection_id))
            await deleteDoc(higherRef)
        }


        alert("Cancelled")
    }
    // console.log(existingBookings)

    const existCheck = (slot) => {
        existingBookings.forEach(book => {
            if(book.date ==slotsDate && slot.time == book.time){
                return {...book}
            }
        })
    }

    return (
    <div className="popup-box">
        <div className="box">
            <span className="close-icon" onClick={handleClose}>x</span>
            {/* <div> */}
                <h4 style={{color:'#1a73e8'}}>Book Time with Dr {props.doctorName}</h4>
                {/* <div className='date'>
                    Select Date <input type="date">{new Date().toDateString()}</input>
                </div> */}

                <div>
                    <span>Select Date Time</span>
                    <input type="date" name="slotDate"  onChange={(e) => selectedDateHandler(e)}/>

                        <table>
                           <thead>
                               <tr>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Book</th>
                               </tr>
                            </thead> 

                            <tbody>
                                {   
                                    slots.map((slot,index) => {
                                        console.log(slots)
                                        const booking = existingBookings.filter(bookin => bookin.date ==slotsDate && slot.time == bookin.time)
                                        // const booking = existCheck(slot)
                                        // alert(slot.time)
                                        // let lis = existingBookings.map(booking => {
                                            // console.log("==>",booking[0])
                                            if(booking[0]){
                                                // console.log("==>",booking)
                                                console.log(slot.time, "mom", index)
                                                return(
                                                    <tr key={slot.id}>
                                                        <td>{slot.time}</td>
                                                        <td>booked</td>
                                                        { 
                                                            booking[0].client_Id === auth.currentUser.uid?
                                                            <td><button onClick={() => {cancelAppointmentHandler(booking[0].id, booking[0].collection_Id)}} style={{backgroundColor: 'crimson', color: '#fff'}}>X</button></td>
                                                            :
                                                            <td><button disabled >+</button></td>
                                                        }
                                                        
                                                    </tr>
                                                )
                                            }
                                            else{
                                                // console.log(slot.time, "fuck", index)
                                                return(
                                                    <tr key={slot.id}>
                                                        <td>{slot.time}</td>
                                                        <td>available</td>
                                                        <td ><button onClick={() => submitAppointement(slot.time)} style={{backgroundColor: 'blue', color: '#fff'}}>+</button></td>
                                                    </tr>
                                                )
                                            }
                                        
                                    }) 
                                }
                                {/* <tr>
                                    <td>{new Date().toLocaleTimeString()}</td>
                                    <td>booked</td>
                                    <td><button style={{backgroundColor: 'crimson', color: '#fff'}}>X</button></td>
                                </tr>
                                <tr>
                                    <td>{new Date().toLocaleTimeString()}</td>
                                    <td>available</td>
                                    <td ><button style={{backgroundColor: 'blue', color: '#fff'}}>+</button></td>
                                </tr>
                                <tr>
                                    <td>{new Date().toLocaleTimeString()}</td>
                                    <td>booked</td>
                                    <td><button disabled >+</button></td>
                                </tr> */}
                            </tbody>
                        </table>
                </div>
            {/* </div> */}
        </div>
    </div>
    )
}

export default Book
