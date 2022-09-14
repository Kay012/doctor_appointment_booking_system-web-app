import React, { useEffect } from 'react'
import Review from '../review/Review'
import Loading from '../../loading/Loading'

const Reviews = ({allReviews}) => {
    useEffect(()=> {
        console.log("allll", allReviews)
    },[])
    

   
    // if(!props.allReviews) return <Loading/>
    return (
        <div>
        {allReviews ?
            allReviews.map(review => (
                <div key={review.id}>
                    <Review  review={review}/>
                </div>
            ))
                :
            // <Loading/>
            <p>No reviews</p>
        }
        </div>
    )
}

export default Reviews
