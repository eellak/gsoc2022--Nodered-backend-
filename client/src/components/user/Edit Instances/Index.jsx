import React, {useState, useEffect} from "react";
import Row from "./Row"

export default (props)=>{
    const [instances, setInstance] = useState([]);
    const [stop, setstop] = useState(0);    

 

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
                          <Row user={props.username} instance={element.name} index={index+1}></Row>
                        )
                     })   
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
};