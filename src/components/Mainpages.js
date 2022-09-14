import React, { useEffect } from 'react'
import ViewDr from './doctorpage/ViewDr'
import Home from './home/Home'
import {Switch, Route} from 'react-router-dom'
import Register from './auth/Register'
import Login from './auth/Login'
import DrHome from '../DrComponents/drHome/DrHome'
import Profile from './profile/Profile'
import Slots from './book/slots/Slots'
import { useSelector } from 'react-redux'
import Loading from './loading/Loading'
import UploadProfileImage from './uploadProfileImage/UploadProfileImage'

const Mainpages = () => {
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    useEffect(() => {
        console.log("mainopage", currentUser)
        
    }, [currentUser])

    
    if(currentUser.role === 1) {
          return(
            <Switch>
                <Route path='/' exact component={Profile} />
                <Route path='/doctor' exact component={ViewDr} />
                <Route path='/upload' exact component={UploadProfileImage} />
                {/* <Route path='/register' exact component={Register}/>
                <Route path='/login' exact component={Login} />

                <Route path='/profile' exact component={Profile} /> */}
                <Route path='/slots' exact component={Slots} />
        </Switch>
          )  
    }
    return (
        <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/viewdr/:id' exact component={ViewDr} />
            <Route path='/register' exact component={Register}/>
            <Route path='/login' exact component={Login} />

            <Route path='/profile' exact component={Profile} />
            <Route path='/slots/:id' exact component={Slots} />
        </Switch>
    )
}

export default Mainpages
