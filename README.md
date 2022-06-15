# gsoc2022--Nodered-WebApp-
To test the current api - 

cd into it and run "npm start".

check routes available in routes directory.

Requests not requiring authorization,
Register/login post requests require two key-value pairs - email, and password.

Authorization requests,
logout post request requires email and token,
and dashboard get request just requires "bearer" token inside "Authorization part" of header- client receives a fresh/updated access token for every request, with one day expiry.
