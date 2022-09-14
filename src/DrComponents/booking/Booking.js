import { Avatar } from '@material-ui/core'
import React from 'react'

const Booking = () => {
    return (
        <div className="booking">
            <div className="booking__top">
                <Avatar alt="ML" />
                {/* <div> */}
                    <h4 style={{paddingLeft:'15px'}}>Lionele Gavu</h4>
                    
                {/* </div> */}

            </div>
            <div className="booking__body">
                <span style={{fontWeight:'bold'}}>{new Date().toLocaleTimeString()} </span>
                {/* <p>Hi I might be late by 10 to 40 minutes, please be patient with me </p> */}
            </div>
        </div>
    )
}

export default Booking
