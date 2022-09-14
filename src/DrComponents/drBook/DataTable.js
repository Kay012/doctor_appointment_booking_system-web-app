import React from 'react'
import './DataTable.css'
const Datatable = () => {
    return (
        <div className="datatable">
            <div style={{display:'flex', flexDirection:'column'}}>
                    <span>{new Date().toDateString()}</span>
                    <span>Time Slots</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Book</th>
                    </tr>
                </thead> 

                <tbody>
                    <tr>
                        <td>{new Date().toLocaleTimeString()}</td>
                        <td>booked</td>
                        <td><button style={{backgroundColor: 'crimson', color: '#fff'}}>X</button></td>
                    </tr>
                    <tr>
                        <td>{new Date().toLocaleTimeString()}</td>
                        <td>available</td>
                        <td ><button style={{backgroundColor: 'blue', color: '#fff'}}>+</button></td>
                    </tr>
                    <tr>
                        <td>{new Date().toLocaleTimeString()}</td>
                        <td>booked</td>
                        <td><button disabled >+</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Datatable
