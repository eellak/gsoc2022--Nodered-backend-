import  {React} from 'react';
import {useNavigate} from 'react-router-dom';
import Google from '../Login/google';
import axios from "axios";

function About(){
    const navigate = useNavigate();

    function handleLogin(email){

        const data={email:email};//console.log(JSON.stringify(data))
        
        axios.post('/login',data).then(response =>{
            // console.log(response.data);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
            navigate('/user-page');
        }).catch(err => console.log(err));
        
    };

    return(
        <div>
    <Google handleLogin={handleLogin}/>
    <div>ABOUT</div>
    {/* <button onClick={()=>{navigate("/login")}}>Log in/Register</button> */}
    </div>
    );
}
export default About;