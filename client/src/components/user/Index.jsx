import React,{useState,useEffect} from 'react';
import {Route, Routes,useNavigate} from "react-router-dom";
import EditInstances from './Edit Instances/index.jsx';
import CloneInstances from './Clone Instances';
import axios from 'axios';

function UserPage({setLoader}) {
  const navigate = useNavigate();
  const [running, setRunning]= useState(false);
  useEffect(()=>{
    let token=JSON.parse(localStorage.getItem("token"));
    let config = {headers:{authorization:token}};
    axios.get('/occupied',config).then(response=>{
      setRunning(response.data.occupied);
      localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
    }).catch(err=>console.log(err));
  },[]);
  function handleStop(e){
    setLoader(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    let token=JSON.parse(localStorage.getItem("token"));
    axios.post('/stop',{annotation:fieldValues.annotation},{headers:{authorization:token}}).then(response => {
      localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
      setLoader(false);
    }).catch(err => console.log(err));
  };
  function handleLogout(e){
    localStorage.removeItem("token");
    navigate('/login');
  }
  // fetch("/api/login").then(response => response.text())
  // .then(data => console.log({data}));
  //research
  return (
    <React.Fragment>
    <button>About</button>
    <button onClick={()=>navigate('/user-page/user-deployments')}>User Deployments</button>
    <button onClick={()=>navigate('/user-page/clone-deployments')}>Clone Deployments</button>
    <button onClick={handleLogout}>Logout</button>
    {running?<form onSubmit={handleStop}>
    <div><span>Annotation:</span><input name='annotation' type="text" /><button type='submit'>Stop</button></div></form>:null   
    }
    <br />
    <button>Edit username</button><span>pop up as in spark site</span>
    
    {
    (
      running?
      <button onClick={handleStop}/>
      : <div>no running containers</div>
      )
    }
   
    {(!running?
      <Routes>

        <Route path="user-deployments" element={<EditInstances setRunning={setRunning} setLoader={setLoader}/>} />
        {/* edit name, description|| edit instance */}

        <Route path="clone-deployments" element={<CloneInstances setRunning={setRunning} setLoader={setLoader}/>} />
        {/* list of available deployments(public+user's) with usernames,title and description|| select and hit create */}
      
    </Routes>
       :<div>Stop running container first

        
       </div> )
    }
    </React.Fragment> 
  );
}

export default UserPage;
