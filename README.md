# gsoc2022--Nodered-WebApp-
To test the current api - 

cd into it and run "npm start".

check routes available in routes directory.

Requests not requiring authorization,
Register/login post requests require two key-value pairs - email, and password.

Authorization requests,
logout post request requires email and token,
and dashboard get request just requires "bearer" token inside "Authorization part" of header- client receives a fresh/updated access token for every request, with one day expiry.

React Client-
will have all the pages/react_routes under src/components,
will  use axios to make api calls using FetchAPI.js under  src/utils.

deployment related Api calls- 
no persistance via volumes,
{
flows.json will be transferred to host via, "cp" command, for storing,
package.json will be transferred to host via, "cp" command => dependencies will be read, and stored => package.json will be deleted.
}
the above steps will persist all necessary minimal info to recreate the instance.
This procedure has an advantage over the one using volumes -> multiple available annotated deployments can be packaged and pulled up in a single container.
