import React, { useState } from "react";
import axios from "axios";

Row= function(props){
    const [container, setContainer] = useState([]);//running container details
    const [error, setError] = useState(""); //api tells about container running limit
    handleEdit= ()=>{
        axios.put('').then((response) => setContainer(response.data.path)).catch((err) => setError(err));
    };
    handleStop= ()=>{
        
        axios.put('').then((response) => setContainer(NULL)).catch((err) => console.log(err));
    };
    return(
        <tr>
        <td>{props.index}</td>
        <td>{props.instance}</td>
        {(container? 
        (<td><button onClick={handleStop} >Stop</button></td>)
        :(<td><button onClick={handleEdit} >Edit</button></td>)
        )}
        </tr>
    );

};

export default Row;