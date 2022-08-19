import  {React} from 'react';
import {useNavigate} from 'react-router-dom';

function About(){
    const navigate = useNavigate();
    return(
        <div>
    <div>ABOUT</div>
    <button onClick={()=>{navigate("/login")}}>Log in/Register</button>
    <div>change to oAuth</div>
    </div>
    );
}
export default About;