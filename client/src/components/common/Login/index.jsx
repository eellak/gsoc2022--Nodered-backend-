import axios from "axios";
// import { response } from "../../../../../api/app";


function Login(){

    function handleLogin(e){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fieldValues = Object.fromEntries(formData.entries());
        // axios.post('/login',{email:fieldValues.email, password:fieldValues.password}).then(
        // response => alert(response)
        // );
        const data={email:fieldValues.email,
        password:fieldValues.password};//console.log(JSON.stringify(data))
        // fetch('/api/temp').then(response=>console.log(response));
        fetch('/api/login',{method:'POST',
    body:JSON.stringify(data),
    headers:{"Content-type":"application/json;charset=UTF-8"}

    }
        ).then(response => console.log(response.headers));
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