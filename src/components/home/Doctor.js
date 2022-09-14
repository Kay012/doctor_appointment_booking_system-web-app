import React, {useEffect, useState} from 'react'
import './Doctor.css'

import { Paper, Button, Avatar } from '@material-ui/core'
import Rating from 'material-ui-rating'
import Img1 from '../../assets/images/img1.jpg'
import Img3 from '../../assets/images/img3.jpg'
import Img2 from '../../assets/images/img2.jpg'
import MoreVert from '@material-ui/icons/MoreVert'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';
import OptionItem from './OptionItem'
import Book from '../book/Book'
// import Stack from '@mui/material/Stack';
const Doctor = (props) => {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState(false)
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
          value={parseFloat(props.doctor.stars).toFixed(1)}
          max={5}
          onChange={(i) => console.log('onChange ' + i)}
          classes={classes}
          readOnly
        />
      );
      const SmallRating = withStyles(smallStyles)(MyRating);
    useEffect(() => {
        const timee = () => {
            if(Number(props.doctor.opens.slice(0,2)) > Number(new Date().toTimeString().slice(0,2))){  
                // && 
                // props.doctor.opens.slice(3,5) > new Date().toTimeString().slice(3,5)
                setOpen(false)
                }
            else if(Number(props.doctor.opens.slice(0,2)) <= Number(new Date().toTimeString().slice(0,2))
                &&
                Number(props.doctor.closes.slice(0,2)) >= Number(new Date().toTimeString().slice(0,2)) ){
                    setOpen(true)
                }
            else{
                setOpen(false)
            }  
        }
        timee()
    },[])
    
    return (
        <div className="body__container">
                <div className="body">
                    <div className="doctor__top">
                        <Avatar src={props.doctor.profile_image} alt="ML"/>
                        <span style={{color:'#4d4d4f', paddingLeft: '15px'}}>Dr {props.doctor.username}</span>
                    </div>
                    <div className="doctor__body">
                        <div className="doc__container">
                            <div className="top__container">
                                <span>{parseFloat(props.doctor.stars).toFixed(1)}</span>
                                {/* <Stack> */}
                                <SmallRating
                                    />
                                {/* </Stack> */}
                            </div>
                        
                            <span style={{color:'#adadad'}}>{props.doctor.profession}</span>
                        </div>
                            <div>
                                <span style={{color:'#4d4d4f'}}>{props.doctor.town}</span>
                            </div>
                            
                            {open?
                                <div className="doc__bottom">
                                    <span style={{color:'blue'}}>Open</span>
                                    <span style={{color:'crimson', paddingLeft:'5px'}}>Closes at {props.doctor.closes} pm</span>
                                </div>
                                :
                                <div className="doc__bottom">
                                    <span style={{color:'crimson'}}>Closed</span>
                                    <span style={{color:'blue', paddingLeft:'5px'}}>Open at {props.doctor.opens} am</span>
                                    
                                </div>
                            }
                        </div>
                    </div>
                    <div className="doc__right">
                    {!options? <IconButton  onClick={() => setOptions(!options)}>
                            <MoreVert />
                        </IconButton>
                         : 
                         <div className="options">
                             <div style={{display:'flex',justifyContent:'flex-end'}}>
                                <IconButton style={{display:'flex',justifyContent:'flex-end'}} onClick={() => setOptions(!options)}>
                                    <Close style={{color:'crimson'}}/>
                                </IconButton>
                            </div>
                            <OptionItem title="View" doctor_id={props.doctor.id}/>
                            <OptionItem title="Book" doctor={props.doctor}/>
                        </div>
                        }
                    </div>
                    
                </div>
    )
}

export default Doctor
