import React,{useState,useEffect} from 'react';
import {Route, Routes,useNavigate} from "react-router-dom";
import EditInstances from './Edit Instances/Index.jsx';
import CloneInstances from './Clone Instances/Index.jsx';
import axios from 'axios';

function UserPage({setLoader}) {
  const navigate = useNavigate();
  const [running, setRunning]= useState(false);
  const [address, setAddress]= useState(null);
  useEffect(()=>{
    let token=JSON.parse(localStorage.getItem("token"));
    let config = {headers:{authorization:token}};
    axios.get('/occupied',config).then(response=>{
      console.log(response.data.port);
      setRunning(response.data.occupied);
      let url = "http://www.crochold.com:"+response.data.port;
      // let url = "http://localhost:"+response.data.port;
      if(response.data.occupied){
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1500);
    }
      setAddress(url);
      localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
    }).catch(err=>{if(err){console.log(err);navigate('/');}});
  },[]);
  function handleStop(e){
    setLoader(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    let token=JSON.parse(localStorage.getItem("token"));
    axios.post('/stop',{annotation:fieldValues.annotation,accessibility:fieldValues.accessibility},{headers:{authorization:token}}).then(response => {
      localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
      setLoader(false);
    }).catch(err => console.log(err));
  };
  function handleLogout(e){
    localStorage.removeItem("token");
    navigate('/');
  }
  const buttonStyle={
    backgroundColor: "green", /* Green */
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px"
  }
  // fetch("/api/login").then(response => response.text())
  // .then(data => console.log({data}));
  //research
  return (
    <React.Fragment>
    <button style={buttonStyle} onClick={()=>{navigate('/')}}>About</button><span> </span>
    <button style={buttonStyle} onClick={()=>navigate('/user-page/user-deployments')}>User Deployments</button><span> </span>
    <button style={buttonStyle} onClick={()=>navigate('/user-page/other-deployments')}>Other Deployments</button><span> </span>
    <button style={buttonStyle} onClick={handleLogout}>Logout</button>
    {running?<form onSubmit={handleStop}>
    <div>
    <p><a href={address} target="_blank">Link</a> to instance</p>
    <p><span>Annotation: </span><input name='annotation' type="text" /></p>
    <p><span>Accessibility: Public</span><input type="radio" name="accessibility" value="Public" checked="checked"/>
    <span>Private</span><input type="radio" name="accessibility" value="Private"/></p>
    <button type='submit'>Stop</button>
    </div>
    </form>:null   
    }
    <br />
    <span>pop up as in spark site</span>
    
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

        <Route path="other-deployments" element={<CloneInstances setRunning={setRunning} setLoader={setLoader}/>} />
        {/* list of available deployments(public+user's) with usernames,title and description|| select and hit create */}
      
    </Routes>
       :<div>Stop running container first

        
       </div> )
    }
    </React.Fragment> 
  );
}

export default UserPage;
