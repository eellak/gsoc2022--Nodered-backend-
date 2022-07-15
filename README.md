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

deployment related controllers' complete final implemenation- 
dockerode API used for creating fresh containers,
child process, "exec" method, used for saving data(flows and dependencies) while killing containers and transferring the same when cloning request is made. Cloning is done in 2 steps- merging the various flow files, installing all required nodes/modules inside container.

NOTE- each user is limited to be able to run only one container at a time on the server, this restriction can be modified if required. Currently each user upon registration is assigned a unique port on the server where his/her containers are going to listen at.

Current registration -> the user needs to provide a uername(unique name of directory in api/data) and a port number, via request body.
USER DATA -> api/data/`${username}`/ contains all the user created annotations, with 2 json files each, flows.json and nodes.json.
for TESTING -> register and make a get call at api/create-fresh, then to stop, make a post call at api/stop along with a annotation in request body, if user wants to save the instance.


#Readme to be restructured... 
