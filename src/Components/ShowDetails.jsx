import React, { useState } from 'react'
import Details from './Details';
import './ShowDetails.css';
import Pagination from './Pagination';
export default function ShowDetails({ data, totalPages }) {
    const [isvisible, setisvisible] = useState(false);
    const [text, settext] = useState("show details");
    const handleDetails = (e) => {
        setisvisible(prev => !prev)
        settext(prev => {
            if (prev === "show details") return "hide details";
            else return "show details";
        })
        e.preventDefault()
    }
    return (
        <>
            <div className="Link-header">
                <a href="/" className="App-link my-2" onClick={handleDetails}>{text}</a>
            </div>
            <div className="Details" >
                {isvisible && <>
                    <Details items={data} totalPages={totalPages}/>
                    <Pagination totalPages={totalPages}></Pagination>
                </>}
            </div>
        </>
    )
}
