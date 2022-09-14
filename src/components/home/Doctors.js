import React, { useState } from 'react'
import Doctor from './Doctor'

const Doctors = (props) => {
    const [counter, setcount] = useState(0)
    return (
        <div>
            {
            props.docs.map((doc,index) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id)
                    // console.log(doc.id)
                    // console.log(snapshot.docs + "==")
                   return (<Doctor key={doc.id} username={doc.email}/>)
                  })
            }
        </div>
        
    )
}

export default Doctors
