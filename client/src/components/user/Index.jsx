import React,{useState} from 'react';
import {Route, Routes} from "react-router-dom";
import EditInstances from './Edit Instances/index.jsx';
import CloneInstances from './Clone Instances';

function UserPage() {
  const [running, setRunning]= useState([]);
  function handleStop(){

  };
  // fetch("/api/login").then(response => response.text())
  // .then(data => console.log({data}));
  //research
  return (
    <React.Fragment>
    <button>About</button>
    <br />
    <button>Edit username</button><span>pop up as in spark site</span>
    
    {
    (
      running.length==1?
      <button onClick={handleStop}/> 
      : <div>no running containers</div>
      )
    }
   
    {(running.length==0?
      <Routes>

        <Route path="user-deployments" element={<EditInstances setRunning={setRunning}/>} />
        {/* edit name, description|| edit instance */}

        <Route path="clone-deployments" element={<CloneInstances setRunning={setRunning}/>} />
        {/* list of available deployments(public+user's) with usernames,title and description|| select and hit create */}
      
    </Routes>
       :<div>Stop running container first

        
       </div> )
    }
    </React.Fragment> 
  );
}

export default UserPage;
