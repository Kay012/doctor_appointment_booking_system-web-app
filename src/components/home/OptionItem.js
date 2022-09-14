import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Book from '../book/Book'
import './OptionItem.css'
import * as Actions from '../../store/actions'
const OptionItem = (props) => {

    const bookStatus = useSelector(state => state.bookStatus.bookStatus)
    const dispatch = useDispatch()

    const handleBookStat = async (e) => {
        e.preventDefault();
        await dispatch(Actions.bookStatuseHandler(bookStatus))
    }
    

    const [book, setBook] = useState(false)
    function Booker() {
        return(
            <div>
            {!bookStatus? 
                <button onClick={handleBookStat}>{props.title}</button>
                : 
                <Book doctorName={props.doctor.username} doctorId={props.doctor.id} doctorProfession={props.doctor.profession}/> 
            }
            </div>
        )
    }
    
    return (
            <div className="optionItem">
                {props.title === 'View'?
                    <Link to={`/viewdr/${props.doctor_id}`}><button>{props.title}</button></Link>
                :
                
                
                <Booker/>
                
                }
            </div>
        
    )
}

export default OptionItem
