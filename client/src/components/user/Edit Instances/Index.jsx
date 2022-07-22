import React, {useState, useEffect} from "react";
import axios from "axios";
import Row from "./Row"

function EditInstances({setRunning}){
    const [instances, setInstance] = useState([]);
    // const [stop, setstop] = useState(0);    
    // useEffect(async () =>{
    //     return 8;
    // });
 

    return(
        <React.Fragment>
            <nav></nav>
            <table>
                <thead>
                    <th>S.No.</th>
                    <th>Instance Name</th>
                    <th></th>
                </thead>
                <tbody>
                    {
                     instances.map((element, index)=>{
                        return(
                          <Row instance={element.name} index={index+1}></Row>
                        )
                     })   
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
};
export default EditInstances;
