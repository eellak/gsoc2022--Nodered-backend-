import React, {useState, useEffect} from "react";
import axios from "axios";
import Row from "./Row"

function EditInstances({setRunning}){
    const [list, setList] = useState([]);
    // const [stop, setstop] = useState(0);    
    // useEffect(async () =>{
    //     return 8;
    // });
    useEffect(()=>{
        // if(list.length === 0){//required ?
            let token=JSON.parse(localStorage.getItem("token"));
            let config = {headers:{authorization:token},params:{personal:true}};
        axios.get('/get-instances',config).then(response => {
            // list=response.data
            console.log(response.data);
            setList(response.data.instances);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
        }).catch(err => console.log(err));
        // }
    },[]);

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
                        
                        list.map((element, index)=>{
                            return(
                                <tr>
                               <td>{index+1}</td>
                               <td>{element.username}:{element.annotation}</td>
                               <td><input type="checkbox" name={index}/></td>
                               </tr>   
                           );
                       })   
                       }
                </tbody>
            </table>
        </React.Fragment>
    );
};
export default EditInstances;
