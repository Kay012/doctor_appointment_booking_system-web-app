import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import Loading from '../loading/Loading'
import { getStorage, ref , getDownloadURL, uploadBytes} from "@firebase/storage";
import {doc, updateDoc} from '@firebase/firestore'
import { db } from '../../firebase/firebaseConfiguration';
import './UploadProfileImage.css'
const UploadProfileImage = () => {
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    const storage = getStorage()
    const [images, setImages] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [saveFile, setSaveFile] = useState()

    const onUpload = async(e) => {
        // e.preventDefault()
        try{

            const file = e.target.files[0]

            if(!file) return alert("No picture found")

            if (file.size > 1024 *1024)  {          //1b
                return alert("File size too large")
            }  
            setIsLoading(true)
            // if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
            //     return alert("Incorrect file format")
            let imag = URL.createObjectURL(file)
            setImages(imag)
            setSaveFile(file)
            // }
            // const storageRef = ref(storage, file.name)
            // // 'file' comes from the Blob or File API
            // await uploadBytes(storageRef, file)

            // console.log("uploaded")
            // setIsLoading(true)
            // const val = await getDownloadURL(storageRef)
            // console.log(val)

            
            // setImages(val)
            setIsLoading(false)
            


        }catch(err){
            alert(err.response.data.msg)
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        const storageRef = ref(storage, saveFile.name)
            // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, saveFile)

        console.log("uploaded")
        setIsLoading(true)
        const val = await getDownloadURL(storageRef)
        
        const userRef = doc(db, 'users', currentUser.id)
        await updateDoc(userRef, {
            profile_image: val
        })
        alert("complete")
    } 
    const styleUpload = {
        display: images? 'block': 'none'
    }

    const handleDestroy = () => {
        setIsLoading(false)
            setImages(false)
    }
    return (
        <div >
           <div className="upload">
                <input type='file' name='file' id='file_up' onChange={(e) => onUpload(e)}/>
                {
                    isLoading? 
                    <div id="file_img">
                        <Loading />
                    </div> 
                    : <div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=''/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </div> 
            <button type="submit" onClick={onSubmit}>Save</button>
        </div>
        
    )
}

export default UploadProfileImage
