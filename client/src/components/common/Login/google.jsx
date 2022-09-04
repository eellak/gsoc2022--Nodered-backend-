import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

function Google({handleLogin}){

    return(
        <GoogleOAuthProvider clientId="885601506951-1bpkv708h511oao881kgl4gj8r87s2m0.apps.googleusercontent.com">
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