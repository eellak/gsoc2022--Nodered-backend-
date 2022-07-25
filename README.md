# gsoc2022--Nodered-WebApp-

Express API (http://localhost:3001/api)
- /register || registers users with unique username and port no.
- /create-fresh || creates fresh instance/container => request's body contains "selections" array with element format {username:"",annotation:"}
  if empty, it creates a new container, otherwise it creates a cloned container => for better insight check user.routes.js
- /stop || stops/kills container, if "annotation" is mentioned in req.body, it saves the instance in user's directory.

all user data is stored in data directory, ex) data/username/userannotation/(2 files flows.json, nodes.json)

Hence, the above api facilitates all possible actions one could think of :), from creating and saving a new instance to cloning multiple instances of other users and saving even that.


Everything controller has been tested with success.

now coming to using these routes,
React Client (http://localhost:3000)

All the components have been written- Edit instance & Clone instance are the ones which will allow user to -> create, edit, stop, clone || essentially everything the web application is about.
Other than these, an about page along with using instructions is also there
The forms with checkboxes to display and collect data, their handlers etc. everything is done.

Things that remain,
- changing regular authentication to O-auth 2.0 to facilitate registering via gmail/github
- configuring cors and fetch api to allow client and api to communicate that and exchange data from database
- A loading wheel- to prevent user from interacting with the page until container's being prepared in backend to then update the same page.

Testing instructions
have two postman tabs opened, 
- one for register/login- to generate token for each call- since it refreshes after each auth request to the api & 
- the second one to make create/stop calls using the body and Authorization(bearer token) sections of the request.

Important Note 
- after starting a container, create another one for the same user only after stopping the previous one, because each user has only one unique port in the server to begin with
- use desktop Postman app, other versions dont support sending array("selections" in our case) with request body or have complicated ways of achieving it.

Thus, 85-90% of the work's done. Any remaining time shall be used to glamourize the Web app frontend further :)
