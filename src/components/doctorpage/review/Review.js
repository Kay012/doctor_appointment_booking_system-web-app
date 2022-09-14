import React, {useState} from 'react'
import Rating from 'material-ui-rating'
import Avatar from '@material-ui/core/Avatar'
import './Review.css'

const Review = ({review}) => {
    
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
          value={review.stars}
          max={5}
          onChange={(i) => console.log('onChange ' + i)}
          classes={classes}
          readOnly
        />
      );
      const SmallRating = withStyles(smallStyles)(MyRating);

    return (
        <div className="reviews">
            <div className="body">
                
                <div className="doctor__top">
                    <Avatar  alt="ML"/>
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <h4 style={{color:'#4d4d4f', paddingLeft: '15px'}}>Dr Mkhululi Cebani</h4>
                        <span style={{color:'#adadad', paddingLeft: '15px', marginTop:'-15px', fontSize:'13px'}}>{review.date}</span>
                    </div>
                </div>
                <div className="doctor__body">
                    <div className="doc__container">
                        <div className="top__container">
                            {/* <Stack> */}
                            <SmallRating
                               
                                />
                            {/* </Stack> */}
                        </div>
                    
                        
                    </div>
                        
                        <div className="doc__bottom">
                            <p>{review.review}</p>
                                
                        </div>
                    </div>
                </div>

            </div>
    )
}

export default Review
