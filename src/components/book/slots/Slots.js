import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { useParams } from 'react-router'
import { db } from '../../../firebase/firebaseConfiguration'
import {collection, query, addDoc, getDocsFromServer, where, doc, updateDoc, deleteDoc} from '@firebase/firestore'
import './Slots.css'
const Slots = () => {


    // const currentUser = useParams()
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    const [slot, setSlot] = useState()
    const [onEdit, setOnEdit] = useState(false)
    const [slots, setSlots] = useState([])
    const [onEditId, setOnEditId] = useState("")
    const [onEditCollectionId, setOnEditCollectionId] = useState("")
    
    useEffect(() => {
        const fetchSlots = async() => {
            
            try{
                let preSlosts = []
                if(currentUser){
                    const snapshot = query(collection(db, "slots"), where("doctor_Id", "==", currentUser.id))
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
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchSlots()
    }, [])

    const createSlot = async e => {

        e.preventDefault()
        try{
            if(onEdit){

                const docRef = doc(db,"slots", onEditCollectionId, "doctorSlots", onEditId )
                await updateDoc(docRef, {
                    time:slot
                })
                alert("Updated")

                setOnEditId("")
                setOnEditCollectionId("")
                setSlot("")
                setOnEdit(false)
                // alert(res.data.msg)
            }
            else {
                const docRef = collection(db, "slots")
                const dr = await addDoc(docRef,{
                    doctor_Id: currentUser.id
                })

                const slotRef = collection(db, "slots", dr.id, "doctorSlots")
                await addDoc(slotRef,{
                    time: slot,
                    collection_id: dr.id
                })


                
                alert("Succesful")
            }
           
            setOnEdit(false)
            

        }catch(err){
            alert(err)
        }
    }

    const editSlot = async (id, collection_id, time) => {
        setOnEditId(id)
        setOnEditCollectionId(collection_id)
        setSlot(time)
        setOnEdit(true)
    }
    const deleteSlot = async (id, collection_id) => {
        try{
            const docRef = doc(db,"slots", collection_id, "doctorSlots", id )
                await deleteDoc(docRef)
                alert("Deleted")

                
        }catch(err){
            alert(err)
        }
       
    }
    return (
        <div className='slots'>
            <form onSubmit={createSlot}>
                <label htmlFor='slot'>Slot</label>
                <input type='time' name='slot' value={slot} required 
                onChange={(e) => setSlot(e.target.value)}
                />

                <button type='submit'>{onEdit? "Update" :"Create"}</button>
            </form>

            <div className="col">
                {
                    slots.map(slot => {
                        console.log(slot.id)
                        return(
                            <div className='row' key={slot.id}>
                                <p>{slot.time}</p>
                                <div>
                                    <button onClick={() => editSlot(slot.id, slot.collection_id, slot.time)}>Edit</button>
                                    <button onClick={() => deleteSlot(slot.id, slot.collection_id)}>Delete</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Slots
