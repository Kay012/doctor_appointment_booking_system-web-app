import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import Rating from 'material-ui-rating'
import Img1 from '../../assets/images/img1.jpg'
import { Paper, Button, Avatar, IconButton } from '@material-ui/core'
import { collection, doc, getDocs, getDocFromServer, getDocsFromServer, getDoc, setDoc, addDoc, query, where, updateDoc } from '@firebase/firestore'
import { db } from '../../firebase/firebaseConfiguration'

import {getAuth} from 'firebase/auth'
import './ViewDr.css'
import Reviews from './reviews/Reviews'
import MoreVert from '@material-ui/icons/MoreVert'
import Book from '../book/Book'

import * as Actions from '../../store/actions'

const initialState = {
    reviewer: "",
    stars: 0,
    review: "",
    timestamp: ""
}

const ViewDr = () => {
    
    const auth = getAuth()
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    const params = useParams()
    const doctors = useSelector(state => state.doctorsList.doctors)

    const [doctorDetails, setDoctorDetails] = useState([])

    const [review, setReview] = useState(initialState)
    const [reviews, setReviews] = useState([])
    const [stars, setStars] = useState(0.0)
    const [drOpen, setDrOpen] = useState(false)

    const onInputChange = (e) => {
        e.preventDefault()

        const {name, value} = e.target
        setReview({...review, [name]: value})
    }
    
    const usersCollectionRef = collection(db, 'reviews')
    useEffect(() => {
        if(params){
            doctors.forEach(doctor => {
                if(doctor.id === params.id){
                    setDoctorDetails(doctor)
                }
            })
        }
        

        const fetchReviews = async() => {
            try{

                let me =[]
                if(currentUser.role === 1){
                    const snapshot = query(collection(db, "reviews"),where("doctor_Id","==", currentUser.id))
                    const querySnapshot = await getDocsFromServer(snapshot)
                    let doccs = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        // console.log(id, data, doc.metadata)
                        return {id}
                    })
                    //    console.log("first fetch")
                        doccs.forEach(async (d) => {
                            const snap = query(collection(db, "reviews", d.id, "reviewers"))
                            
                            const querySnap = await getDocsFromServer(snap)
                            let docccs = querySnap.docs.map( (dot) => {
                                const data = dot.data();
                                const id = dot.id;
                                // console.log("yeah", {id, ...data})
                                // console.log(me)
                                me.push({id, ...data})
                                setReviews([...me])
                                // return {id, ...data}
                                });
                                
                        
                            // console.log(reviews)
                        })
                }
                else if(currentUser.role === 0){
                    const snapshot = query(collection(db, "reviews"),where("doctor_Id","==", params.id))
                    const querySnapshot = await getDocsFromServer(snapshot)
                    let doccs = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        // console.log(id, data, doc.metadata)
                        return {id}
                    })
                    //    console.log("first fetch")
                        doccs.forEach(async (d) => {
                            const snap = query(collection(db, "reviews", d.id, "reviewers"))
                            
                            const querySnap = await getDocsFromServer(snap)
                            let docccs = querySnap.docs.map( (dot) => {
                                const data = dot.data();
                                const id = dot.id;
                                // console.log("yeah", {id, ...data})
                                // console.log(me)
                                me.push({id, ...data})
                                setReviews([...me])
                                // return {id, ...data}
                                });
                                
                        
                            // console.log(reviews)
                        })
                }
                // console.log(me)
                console.log(reviews)
                const reviewsAverage = () => {
                    let summ = 0.0;
                    reviews.forEach(rev => {
                        
                        summ += rev.stars
                        console.log("yooooo",summ, rev.stars)
                    })
                    setStars((summ/(reviews.length*5)) * 5)
                    console.log(stars)
                }
                reviewsAverage()
            }catch(err){
                console.log(err)
            }
        }
        fetchReviews()

        const timee = () => {
            if(Number(currentUser.opens.slice(0,2)) > Number(new Date().toTimeString().slice(0,2))){  
                // && 
                // currentUser.opens.slice(3,5) > new Date().toTimeString().slice(3,5)
                setDrOpen(false)
                }
            else if(Number(currentUser.opens.slice(0,2)) <= Number(new Date().toTimeString().slice(0,2))
                &&
                Number(currentUser.closes.slice(0,2)) >= Number(new Date().toTimeString().slice(0,2)) ){
                    setDrOpen(true)
                }
            else{
                setDrOpen(false)
            }  
        }
        if (currentUser.role === 1) {timee()}

    }, [params, doctors])
    const { withStyles } = require('@material-ui/core/styles');
    const smallStyles = {
        iconButton: {
            width: 25,
            height: 25,
            padding: 15
        },
        icon: {
            width: 18,
            height: 18
        }
    };

    const MyRating = ({classes}) => (
        <Rating
          value={params.id? doctorDetails.stars: currentUser.stars}
          max={5}
          onChange={(i) => console.log('onChange ' + i)}
          classes={classes}
          readOnly
        />
      );

      const MyRater = ({classes}) => (
        <Rating
          value={review.stars}
          max={5}
          onChange={rate => setReview({...review, stars: rate})}
          classes={classes}
          
        />
      );
      const SmallRating = withStyles(smallStyles)(MyRating);
      const SmallRater = withStyles(smallStyles)(MyRater);

    const bookStatus = useSelector(state => state.bookStatus.bookStatus)
    const dispatch = useDispatch()

    const handleBookStat = async (e) => {
        e.preventDefault();
        await dispatch(Actions.bookStatuseHandler(bookStatus))
    }

    const onChanger = () => {
        setOpen(!open)
    }
    const [options, setOptions] = useState(false)
    const [open, setOpen] = useState(false)
    const [write, setWrite] = useState(false)


    const submitReview = async() => {
        try{
            const docRef = collection(db, "reviews")
            const dr =await addDoc(docRef, {
                doctor_Id: params.id    
            })
            
            const revRef = collection(db, "reviews", dr.id, "reviewers")
            await addDoc(revRef, {
                reviewer: auth.currentUser.uid,
                stars: review.stars,
                review: review.review,
                time: new Date().toLocaleTimeString(),
                date: new Date().toDateString()
            })



            const fetchReviews = async() => {
                try{
    
                    let me =[]
                    if(currentUser.role === 1){
                        const snapshot = query(collection(db, "reviews"),where("doctor_Id","==", currentUser.id))
                        const querySnapshot = await getDocsFromServer(snapshot)
                        let doccs = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            const id = doc.id;
                            // console.log(id, data, doc.metadata)
                            return {id}
                        })
                        //    console.log("first fetch")
                            doccs.forEach(async (d) => {
                                const snap = query(collection(db, "reviews", d.id, "reviewers"))
                                
                                const querySnap = await getDocsFromServer(snap)
                                let docccs = querySnap.docs.map( (dot) => {
                                    const data = dot.data();
                                    const id = dot.id;
                                    // console.log("yeah", {id, ...data})
                                    // console.log(me)
                                    me.push({id, ...data})
                                    setReviews(me)
                                    // return {id, ...data}
                                    });
                                    
                            
                                // console.log(reviews)
                            })
                    }
                    else if(currentUser.role === 0){
                        const snapshot = query(collection(db, "reviews"),where("doctor_Id","==", params.id))
                        const querySnapshot = await getDocsFromServer(snapshot)
                        let doccs = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            const id = doc.id;
                            // console.log(id, data, doc.metadata)
                            return {id}
                        })
                        //    console.log("first fetch")
                            doccs.forEach(async (d) => {
                                const snap = query(collection(db, "reviews", d.id, "reviewers"))
                                
                                const querySnap = await getDocsFromServer(snap)
                                let docccs = querySnap.docs.map( (dot) => {
                                    const data = dot.data();
                                    const id = dot.id;
                                    // console.log("yeah", {id, ...data})
                                    // console.log(me)
                                    me.push({id, ...data})
                                    setReviews(me)
                                    // return {id, ...data}
                                    });
                                    
                            
                                // console.log(reviews)
                            })
                    }
                    
                    // console.log(me)
                    // console.log(reviews)
                    const reviewsAverage = () => {
                        let summ = 0.0
                        reviews.forEach(rev => {
                            
                            summ += rev.stars
                            // console.log(summ, rev.stars)
                        })
                        setStars((parseFloat((summ+review.stars)/((reviews.length + 1)*5)) * 5))
                        console.log(summ+review.stars)
                        console.log((((summ+review.stars)/((reviews.length + 1)*5)) * 5))
                    }
                    reviewsAverage()
                }catch(err){
                    console.log(err)
                }
            }
            fetchReviews()
    

            console.log("starssss")
            const drRef = doc(db, "users", params.id)
            await updateDoc(drRef, {
                stars:stars
            })
            
        console.log("Review Successful")
        }catch(err){
            console.log(err)
        }

    }
    
    

    // if(doctorDetails.length === 0) return null;

    // console.log("==>",reviews)
    
    
    // console.log(stars, reviews.length)
    if(currentUser.role === 1){
        return(
            <div className="view">
            <h4>Dr {currentUser.username}</h4>
            <div className="view__container">
                <div className="container__left">
                    <div className="image">
                        <img src={currentUser.profile_image} alt="" />
                    </div>
                    <div className="overview">
                        <h4>Overview</h4>
                    <div className="body">
                    <div className="doctor__top">
                        <span style={{color:'#4d4d4f', fontWeight:'bold'}}>Dr {currentUser.username}</span>
                    </div>
                    <div className="doctor__body">
                        <div className="doc__container">
                            <div className="top__container">
                                <span>{currentUser.stars}</span>
                                {/* <Stack> */}
                                <SmallRating 
                                    />
                                {/* </Stack> */}
                            </div>
                        
                            <span style={{color:'#adadad'}}>{currentUser.profession}</span>
                        </div>
                            <div>
                                <span style={{color:'#4d4d4f'}}>{currentUser.town}</span>
                            </div>
                            <div className="doc__bottom">
                            {drOpen?
                                <div className="doc__bottom">
                                    <span style={{color:'blue'}}>Open</span>
                                    <span style={{color:'crimson', paddingLeft:'5px'}}>Closes at {currentUser.closes} pm</span>
                                </div>
                                :
                                <div className="doc__bottom">
                                    <span style={{color:'crimson'}}>Closed</span>
                                    <span style={{color:'blue', paddingLeft:'5px'}}>Open at {currentUser.opens} am</span>
                                    
                                </div>
                            }
                            </div>
                        </div>
                        <Link to={`/slots`}>Slots</Link>
                        <Link to={'upload'}>Add Profile Picture</Link>
                    </div>

                    </div>
                </div>
                <div style={{marginTop: '3  5px'}}>
                    <div style={{display:'flex', gap:'30px'}}>
                        <div className="tab">
                            <h4 onClick={onChanger} style={{color:!open? '#1a73e8': '#4d4d4f', borderBottom: !open?'2px solid #1a73e8':'none'}}>Reviews ({reviews.length})</h4>
                        </div>
                        <div className="tab">
                            <h4 onClick={onChanger} style={{color:open? '#1a73e8': '#4d4d4f', borderBottom: open?'2px solid #1a73e8':'none'}}>Photos</h4>
                        </div>
                    </div>
                    
                    <div className="container__right">
                        {!open? 
                        <div style={{display: 'flex', flexDirection:'column',paddingTop:'15px'}}>
                            
                            <Reviews allReviews={reviews}/>
                 
                        </div>
                        :
                        <div className="photos">
                            
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>

                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                        </div>
                        }
                    </div>
                </div>


                

            </div>
            
        </div>
        )
    }
    return (
        <div className="view">
            <h4>Dr {doctorDetails.username}</h4>
            <div className="view__container">
                <div className="container__left">
                    <div className="image">
                        <img src={Img1} alt="" />
                    </div>
                    <div className="overview">
                        <h4>Overview</h4>
                    <div className="body">
                    <div className="doctor__top">
                        <span style={{color:'#4d4d4f', fontWeight:'bold'}}>Dr {doctorDetails.username}</span>
                    </div>
                    <div className="doctor__body">
                        <div className="doc__container">
                            <div className="top__container">
                                <span>{parseFloat(doctorDetails.stars).toFixed(1)}</span>
                                {/* <Stack> */}
                                <SmallRating 
                                    />
                                {/* </Stack> */}
                            </div>
                        
                            <span style={{color:'#adadad'}}>{doctorDetails.profession}</span>
                        </div>
                            <div>
                                <span style={{color:'#4d4d4f'}}>{doctorDetails.town}</span>
                            </div>
                            <div className="doc__bottom">
                            {/* {open?
                                <div className="doc__bottom">
                                    <span style={{color:'blue'}}>Open</span>
                                    <span style={{color:'crimson', paddingLeft:'5px'}}>Closes at {props.doctor.closes} pm</span>
                                </div>
                                :
                                <div className="doc__bottom">
                                    <span style={{color:'crimson'}}>Closed</span>
                                    <span style={{color:'blue', paddingLeft:'5px'}}>Open at {props.doctor.opens} am</span>
                                    
                                </div>
                            } */}
                            </div>
                        </div>
                        {!bookStatus? <button onClick={handleBookStat}>Book</button>
                         : 
                        //  <div className="options">
                        //      <div style={{display:'flex',justifyContent:'flex-end'}}>
                        //         <IconButton style={{display:'flex',justifyContent:'flex-end'}} onClick={() => setOptions(!options)}>
                        //             <Close style={{color:'crimson'}}/>
                        //         </IconButton>
                        //     </div>
                        //     <OptionItem title="View"/>
                        //     <OptionItem title="Book"/>
                        // </div>
                        <Book doctorName={doctorDetails.username} doctorId={params.id} doctorProfession={doctorDetails.profession}/>
                        }
                    </div>

                    </div>
                </div>
                <div style={{marginTop: '3  5px'}}>
                    <div style={{display:'flex', gap:'30px'}}>
                        <div className="tab">
                            <h4 onClick={onChanger} style={{color:!open? '#1a73e8': '#4d4d4f', borderBottom: !open?'2px solid #1a73e8':'none'}}>Reviews ({reviews.length})</h4>
                        </div>
                        <div className="tab">
                            <h4 onClick={onChanger} style={{color:open? '#1a73e8': '#4d4d4f', borderBottom: open?'2px solid #1a73e8':'none'}}>Photos</h4>
                        </div>
                    </div>
                    
                    <div className="container__right">
                        {!open? 
                        <div style={{display: 'flex', flexDirection:'column',paddingTop:'15px'}}>
                            {currentUser.role===0 &&
                            <div style={{justifyContent:'flex-start'}}><span onClick={() => setWrite(true)}>Write a review</span></div>}
                            {write && 
                            <div>
                                <div>
                                    <SmallRater
                                        />

                                    <textarea name="review" rows={5} onChange={onInputChange}/>
                                </div>

                                <div style={{display:'flex'}}>
                                    <button onClick={() => setWrite(false)}>Cancel</button>
                                    <button onClick={submitReview}>Submit</button>
                                </div>
                            </div>
                                
                            }
                            <Reviews allReviews={reviews}/>
                 
                        </div>
                        :
                        <div className="photos">
                            
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>

                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                            <div className="image">
                                <img src={Img1} alt="" />
                            </div>
                        </div>
                        }
                    </div>
                </div>


                

            </div>
            
        </div>
    )
}

export default ViewDr
