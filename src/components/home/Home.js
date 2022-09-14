import React, { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import  Search  from '@material-ui/icons/Search'
import {db} from '../../firebase/firebaseConfiguration'
import { collection, doc, getDocs, setDoc,getDocsFromServer,where, query  } from '@firebase/firestore'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import './Home.css'
import Doctors from './Doctors'
import Doctor from './Doctor'
import { useDispatch, useSelector } from 'react-redux'
import * as Actions from '../../store/actions'
import Loading from '../loading/Loading'

const Home = () => {
    // const [doctors, setDoctors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const auth = getAuth()
    const dispatch = useDispatch()
    useEffect(() => {
        
        const userAuth = async() => {

            const currentUSer_id = auth.currentUser.uid;
            if(currentUSer_id){
                // dispatch(Actions.fetchUser(currentUSer_id))
                // auth.onAuthStateChanged((user) => {
                //     if (!user) {
                //         this.setState({
                //         loggedIn: false,
                //         loaded: true,
                //         })
                //         console.log(this.state.loggedIn)
                //     } else {
                //         this.setState({
                //         loggedIn: true,
                //         loaded: true,
                //         })
                //     }
                //     console.log(this.state.loggedIn)
                //     console.log(this.state.loaded)
                //     console.log(currentUSer)
                // })   
            }
        }
        const fetchdoctors = async () => {
            setIsLoading(true)
            
            await dispatch(Actions.fetchDoctors())
            setIsLoading(false)
        }
        
        fetchdoctors()
        // setIsLoading(false)
        
        // setIsLoading(false)

        
    }, [])
    const doctors = useSelector(state => state.doctorsList.doctors)

    // console.log(doctors)

    const [showDoctors, setShowDoctors] = useState(doctors)
    
    
    const [townDoctors, setTownDoctors] = useState([])
    const [professionDoctors, setProfessionDoctors] = useState([])
    const [town, setTown] = useState("")
    const [profession, setProfession] = useState("")
    

    
    const fetchDoctorsByTown = async (town) => {
        if(!town) {
            setShowDoctors([...doctors])
            setTownDoctors([...doctors])
        }
        else{
            let doctorsByTown = doctors.filter(doctor => doctor.town === town)
            console.log(doctorsByTown)
            setTownDoctors([...doctorsByTown])
            setShowDoctors([...doctorsByTown])
            console.log("ÿes")
        }
    }
    

    const fetchDoctorsByProfession = async (profession) => {
        if(!profession) {
            if(!townDoctors){
                setShowDoctors([...doctors])
                setProfessionDoctors([...townDoctors])
            }else{
                setShowDoctors([...townDoctors])
                setProfessionDoctors([...townDoctors])
            }
        }
        else{
            let doctorsByProfession = townDoctors.filter(doctor => doctor.profession === profession)
            // console.log(doctorsByTown)
            setProfessionDoctors([...doctorsByProfession])
            setShowDoctors([...doctorsByProfession])
            console.log("no")
        }
    }
    // let doctorsByName = doctors.filter(doctor => doctor.email.toString() >= "Ka")
    const fetchDoctorsByName = async (search) => {
        // let doctorsByName = professionDoctors.filter(doctor => doctor.email.toString() >= "lio")
        // doctorsByName.map(doc => {
        //     console.log(doc.email)
        //     const data = doc.data();
        //     const id = doc.id;
        //     return { id, ...data }
        if(!search){
            setShowDoctors([...doctors])
        }else{
            console.log(search)
            const snapshot = query(collection(db, "users"),where("role","==", 1), where("username",">=", search))
            const querySnapshot = await getDocsFromServer(snapshot)
            let doccs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                console.log(id)
                console.log("here")
                return { id, ...data }
                });

            // console.log(doccs)
            setShowDoctors([...doccs])
        }
    //     // setShowDoctors(doctorsByName)
    //     console.log("amen")
    }


//     function Item(props)
// {
//     return (
//         <Paper style={{height:'400px', width:'80%',backgroundImage:"url(" +  props.item.image  + ")"}}>
            
//             <h2>{props.item.name}</h2>
//             <p>{props.item.description}</p>
            

//             <Button className="CheckButton">
//                 Check it out!
//             </Button>
//         </Paper>
//     )
// }

//     var items = [
//         {
//             name: "Random Name #1",
//             description: "Probably the most random thing you have ever seen!",
//             image: Img1
//         },
//         {
//             name: "Random Name #2",
//             description: "Hello World!",
//             image:Img2
            
//         },
//         {
//             name: "Awe #2",
//             description: "Hello World!",
//             image:Img3
            
//         }
//     ]
    // console.log(doctors.length)
    
    // if(doctors.length>0){
    //     setIsLoading(false)
    // }

    // if(isLoading){} 
    
    
    console.log(showDoctors, "pp")
    console.log(doctors)
    return (
        
        // <div style={{justifyContent:'center', alignSelf:'center'}}>
        // <Carousel >
        //     {
        //         items.map( (item, i) => <Item key={i} item={item} /> )
        //     }
        // </Carousel>
        // </div>
        <div className="home">
            <div className="home__top">
                <div className="top__left">
                    <span>Filter by</span>
                    <select name="" id="" 
                    onChange={(e) => fetchDoctorsByTown(e.target.value)}
                    >
                        <option value="">Town</option>
                        <option value="Johannesburg">Johannesburg</option>
                    </select>

                    <select name="" id="" onChange={(e) => fetchDoctorsByProfession(e.target.value)}>
                        <option value="">profession</option>
                        <option value="Dentist">Dentist</option>
                        <option value="General Practitioner">General Practitioner</option>
                    </select>

                    <select name="" id="">
                        <option value="">Distance</option>
                    </select>
                </div>
                

                <div className="top__right">
                    <div className="header_search">
                        <Search />
                        <span>Dr</span>
                        <input type="text" placeholder="Search"
                        style={{paddingLeft: '5px'}}
                         onChange={e => fetchDoctorsByName(e.target.value)}
                         
                         />
                    </div>
                </div>
            </div>
            {doctors &&
            // <Doctors docs={doctors}/>
            isLoading? 
                <div><Loading /></div>: showDoctors.map(doc => (
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id)
                // console.log(doc.id)
                // console.log(snapshot.docs + "==")
               <Doctor key={doc.id} doctor={doc}/>
            ))
            
            }
            {/* <Doctors/> */}
        </div>
    )
}

export default Home
