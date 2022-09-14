import { getAuth } from '@firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import Header from './components/headers/Header';
import Loading from './components/loading/Loading';
import Mainpages from './components/Mainpages';
import * as Actions from './store/actions'
const MainApp = () => {''
const [userId, setUserId] = useState("")
const [isLoading, setIsLoading] = useState(false)
const auth = getAuth()
const dispatch = useDispatch()

useEffect(() => {
  const esish = async() => {
    auth.onAuthStateChanged(async(user) => {
        if(user){
            setIsLoading(true)
                await dispatch(Actions.fetchUser(user.uid))
            setIsLoading(false)
        }
      
    })
    
    
  }
  esish()
  
    
}, [])
if(isLoading) return <Loading/>
return(
  <Router>
      <div className="App">
        <div className="head">
            <Header/>
        </div>
        <div className='mainpages'>
          <Mainpages/>
        </div>
      </div>
    </Router>
)
}

export default MainApp
