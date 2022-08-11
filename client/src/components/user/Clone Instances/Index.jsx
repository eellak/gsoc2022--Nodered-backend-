import React, {useState, useEffect} from "react";
import axios from "axios";

export default ({setRunning})=>{
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
            console.log(response.data);
            setList(response.data.instances);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
        }).catch(err => console.log(err));
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
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    let selections=[];
    for(let i in fieldValues){
        selections.push({username:list[i].user,annotation:list[i].instance});
    }
    axios({
        method:'post',
        url:'/clone-instances',
        data: selections
    });
    setWasSubmitted(true);
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
                    <th>Clone</th>
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
            <button type="submit">Submit</button>
        </form>
    </React.Fragment>
    );
};