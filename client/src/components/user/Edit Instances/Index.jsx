import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
// import Row from "./Row"
// import { response } from "../../../../../api/app";

function EditInstances({setRunning,setLoader}){
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [wasSubmitted, setWasSubmitted] = useState(0);
    // const [wasClicked, setWasClicked] = useState(null);
    let wasClicked=null;
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
            setRunning(response.data.occupied);
            setList(response.data.instances);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
        }).catch(err => {if(err){console.log(err);navigate('/');}});
        // }
    },[]);
     
   function handleSubmit(e){
    setLoader(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    let selection = [];selection.push(list[fieldValues.selected]);
    if(!selection)return;

    let token=JSON.parse(localStorage.getItem("token"));
    if(wasClicked === "Delete"){

    axios({
        method:'delete',
        url:'/delete-instance',
        headers:{authorization:token},
        data: {annotation:selection}
    }).then(response=>{
        console.log(response.data);
        localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));   
        setLoader(false);
    }).catch(err=>console.log(err));
}  
    else{
        axios.post('/create-fresh',{selections:selection},{headers:{authorization:token}}).then(response => {
            console.log(response.data);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
            setLoader(false);
        }).catch(err => console.log(err));
    }
    // setRunning(true);
    // setWasSubmitted(wasSubmitted^1);
    navigate('/user-page');
    } 

    return(
        <React.Fragment>
            <nav></nav>
            <form onSubmit={handleSubmit}>
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
                               <td>{element.annotation}</td>
                               <td><input type="radio" name="selected" value={index}/></td>
                               </tr>   
                           );
                       })   
                       }
                </tbody>
            </table>
            <input type="submit" name="button1" onClick={()=>{wasClicked='Edit'}} value="Create"/>
            <input type="submit" name="button2" onClick={()=>{wasClicked='Delete'}} value="Delete"/>
            </form>
        </React.Fragment>
    );
};
export default EditInstances;
