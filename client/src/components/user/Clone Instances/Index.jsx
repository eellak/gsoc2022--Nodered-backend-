import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default ({setRunning,setLoader})=>{
    const navigate = useNavigate();
    const [wasSubmitted, setWasSubmitted] = useState(false);
    const [list, setList] = useState([]);
    // const [config,setConfig] = useState({});
    // var list=[];//array of objects
    
    useEffect(()=>{
        // if(list.length === 0){//required ?
            let token=JSON.parse(localStorage.getItem("token"));
            let config = {headers:{authorization:token}};
        axios.get('/get-instances',config).then(response => {
            // list=response.data
            // console.log(response.data);
            setList(response.data.instances);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
        }).catch(err => {if(err){console.log(err);navigate('/');}});
        // }
    },[]);//run on only initial render || find more inf,, if refresh rerenders it's cool
    
    
    // useEffect(()=>{
    //     axios.post('/login',{email:"testemail",password:"testpassword"}).then(response => {
    //         // list=response.data
    //         // console.log(response.data.headers.authorization);
    //         localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
        
    //     }).catch(err => console.log(err));

    // },[]);
 
   function handleSubmit(e){
       setLoader(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    let selections=[];
    for(let i in fieldValues){
        selections.push({username:list[i].username,annotation:list[i].annotation});
    }
    let token=JSON.parse(localStorage.getItem("token"));
    let config = {headers:{authorization:token}};
axios.post('/create-fresh',{selections:selections},config).then(response => {
    console.log(response.data);
    localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
    setLoader(false);
    navigate('/user-page');
}).catch(err => console.log(err));
// setRunning(true);
    // setWasSubmitted(true);
    }
//Loader->when container running-> setwassubmitted
    return(
    <React.Fragment>
        <div>red</div>
            <nav></nav>
        <form onSubmit={handleSubmit}>
            <table>
                <thead>
                    <th>S.No.</th>
                    <th>User: Instance Name</th>
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
            <button type="submit">Create</button>
        </form>
    </React.Fragment>
    );
};