import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

function Google({handleLogin}){

    return(
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <GoogleLogin
            onSuccess={response =>{
                handleLogin(jwt_decode(response.credential).email);
            }}
            onError={()=>{
                console.log('failed');
            }}
        />
        </GoogleOAuthProvider>
    )
}

export default Google;