import { Avatar } from '@material-ui/core'
import React from 'react'
import Booking from '../booking/Booking'
import Datatable from './DataTable'
import './DrBook.css'
const DrBook = () => {
    return (
        <div >
            <div className="today">
                {/* style={{display:'flex', alignItems: 'center'}} */}
                <h4>TODAY'S BOOKINGS</h4>
                <div className="bookings">
                    
                    <Booking/>
                    <Booking/>
                    <Booking/>
                    <Booking/>
                    <Booking/>
                    <Booking/>

                </div>

            </div>

            <div className="popup-box_">
            <div className="box_">
            {/* <span className="close-icon" onClick={handleClose}>x</span> */}
            {/* <div> */}
                <h4 style={{color:'#1a73e8'}}>Weekly Schedule</h4>
                {/* <div className='date'>
                    Select Date <input type="date">{new Date().toDateString()}</input>
                </div> */}
                <Datatable/>
                <Datatable/>
                <Datatable/>
                <Datatable/>
            </div>
        </div>
            
        </div>
    )
}

export default DrBook
