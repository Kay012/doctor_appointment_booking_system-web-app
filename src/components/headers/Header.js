import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { signOut, getAuth } from '@firebase/auth'
import * as Actions from '../../store/actions'
import './Header.css'
const Header = () => {
    const auth = getAuth()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.currentUser.currentUserDetails)
    useEffect(() => {
        console.log("===>",currentUser)
    }, [currentUser])

    const onLogout = async() => {
        await signOut(auth)
        await dispatch(Actions.SignOutUser())
        window.location.href='/'
        console.log("signed ou")
    }

    // console.log("head", currentUser)

    const logged = () => (
        <>
            {currentUser.role ===0?
                <div style={{marginRight:'2rem'}}><Link to="/profile">{currentUser.username}</Link></div>
                :<div style={{marginRight:'2rem'}}><Link to={`/doctor`}>{currentUser.username}</Link></div>
            }
            <div><Link to="" onClick={onLogout}>Sign Out</Link></div>
        </>
    )

    const loggedOut = () => (
        <>
            <div style={{marginRight:'2rem'}}><Link to="/login">Sign In</Link></div>
            <div><Link to="/register">Sign Up</Link></div>
        </>
    )
    
    return (
        <div className="header">
            <div className="header__left">
                <div className="logo"><Link to="/" style={{textDecoration:'none'}}><h4>Doctor Plug</h4></Link></div>
                <div className="help"><Link to="/drhome" style={{marginLeft: '2rem'}}>help</Link></div>
            </div>

            <div className="header__right">
                {currentUser.username?
                    logged()
                :
                    loggedOut()
                }
            </div>
            
            
        </div>
    )
}

export default Header
