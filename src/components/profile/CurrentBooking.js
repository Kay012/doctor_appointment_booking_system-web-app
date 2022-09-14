import { Avatar } from '@material-ui/core'
import React from 'react'

import Rating from 'material-ui-rating'
import './CurrentBooking.css'
const CurrentBooking = ({booking, role}) => {

    const { withStyles } = require('@material-ui/core/styles');
    const smallStyles = {
        iconButton: {
            width: 25,
            height: 25,
            padding: 8
        },
        icon: {
            width: 15,
            height: 15
        }
    };

    const MyRating = ({classes}) => (
        <Rating
          value={3}
          max={5}
          onChange={(i) => console.log('onChange ' + i)}
          classes={classes}
          readOnly
        />
      );
      const SmallRating = withStyles(smallStyles)(MyRating);
    //   console.log(booking)
    if(role === 1){
        return (
            <div>
              <div className="current__booking">
                        <div className="booking__top">
                            <Avatar alt=""/>
                            <span>{booking.client_Name}</span>
                        </div>
                        <div className="service">
                            {/* <span>4.6</span>
                            <SmallRating /> */}
                            <span style={{color:'#adadad'}}>{booking.client_Cellphone} || {booking.client_Email}</span>
                        </div>
                        <div>
                            <span style={{fontWeight:'bold'}}>{booking.date},  {booking.time} </span>
                        </div>
                        <span>cancelled</span>
                    </div>  
            </div>
        )
    }
    return (
        <div>
          <div className="current__booking">
                    <div className="booking__top">
                        <Avatar alt=""/>
                        <span>Dr {booking.doctor_Name}</span>
                    </div>
                    <div className="service">
                        {/* <span>4.6</span>
                        <SmallRating /> */}
                        <span style={{color:'#adadad'}}>{booking.doctor_Profession}</span>
                    </div>
                    <div>
                        <span style={{fontWeight:'bold'}}>{booking.date},  {booking.time} </span>
                    </div>
                    <span>cancelled</span>
                </div>  
        </div>
    )
}

export default CurrentBooking
