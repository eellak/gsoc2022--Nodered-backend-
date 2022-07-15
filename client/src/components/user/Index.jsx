import {Route, Routes} from "react-router-dom"; 
import logo from './logo.svg';
import './App.css';
import { Fragment } from "react";

function UserPage() {
  fetch("/api/fresh").then(response => response.text())
  .then(data => console.log({data}));
  //research
  return (
    <React.Fragment>
    About Baloon, Edit Username pop up like spark
    <Routes>

        <Route path="/user-deployments" element={<EditInstances/>} />
        {/* edit name, description|| edit instance */}

        <Route path="/clone-deployments" element={<CloneInstances/>} />
        {/* list of available deployments(public+user's) with usernames,title and description|| select and hit create */}
      
    </Routes>
    </React.Fragment> 
  );
}

export default UserPage;
