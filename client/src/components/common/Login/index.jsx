import axios from "axios";
// import { response } from "../../../../../api/app";
import {useNavigate} from 'react-router-dom';

function Login(){
const navigate = useNavigate();
    function handleLogin(e){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fieldValues = Object.fromEntries(formData.entries());
        // axios.post('/login',{email:fieldValues.email, password:fieldValues.password}).then(
        // response => alert(response)
        // );
        const data={email:fieldValues.email,
        password:fieldValues.password};//console.log(JSON.stringify(data))

        axios.post('/login',data).then(response =>{
            // console.log(response.data);
            localStorage.setItem("token",JSON.stringify('Bearer '+response.data.headers.authorization));
            navigate('/user-page');
        }).catch(err => console.log(err));
        
    };
    return(
        <form onSubmit={handleLogin}>

        <input type="text" name="email" placeholder="email"/>
        <input type="text" name="password" placeholder="password"/>
        <button type="submit">login</button>
        
        </form>
    )
};
export default Login;