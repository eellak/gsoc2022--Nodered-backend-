# gsoc2022--Nodered-WebApp-

## BASE IDEA
NodeRed is one of the most well known low-code IoT programming tools, offering a large number of ready-to-use libraries. Nevertheless, it lacks modern aspects of system deployments, like multi-user server functionalities, since one NodeRed deployment can support only one user. In this context we propose a web application written in NodeJs, that will provide a web-based interface, via which the management (creation, deletion and deployment) of NodeRed instances will be performed. Each NodeRed instance will be deployed using Docker. Furthermore, the system will support saving annotated NodeRed deployments which contain specific nodes (or flows), so as to easily create new deployments that offer personalized/aggregated functionality. E.g. if a user creates flows annotated as "Raspberry Pi GPIO" and another creates "Google Firebase", the system should be able to create a new NodeRed instance that contains one of these flow sets or both, according to what the end user needs.

## FINALIZED USE-CASES
<ul>
<li>Users will be able to sign-in/sign-up via Google Oauth.</li>
<li>Users can create a "fresh" Node-Red instance(technically, deploy a docker container on server for themselves), and then can save their work by providing an "annotation" & "accessibility"(public/private) before killing their instance.</li>
<li>Users can access other people's (public)work, and create a "cloned" Node-Red instance, which could also be a merged-product of multiple instances, depending upon the number of instances, the user selected to be cloned.</li>
<li>The user is currently allowed to only fire up one container at a time on the server. He/She is required to stop a currently running instance to be able to fire up a new one.</li> 
</ul>

## INTERFACE
Upon login, the user is shown his/her dashboard, which has two lists- "User Deployments" & "Others Deployments". The User-list allows user to select none/one instance to create fresh/ clone a past or delete a past annotation respectively. The Others-list also allows user to do all that, except the deleting option. The Others-list also allows user to select multiple instances at a time while cloning, hence deploy one instance, containing all the flows/works he/she chose from the list. Apart from the two lists there is also a logout button available.

## TECH STACK USED
MERN stack, Docker, AWS EC2 host.

## FLOW
<img src="https://user-images.githubusercontent.com/89726452/190868986-510bde50-fcce-48a9-adf0-fa3be7e76609.jpeg" width="750" height="350">

## CURRENT IMPLEMENTATION
Upon registration, the user is assigned a unique username(generated from his email), and a unique available port number on the host. The api uses docker to run Node-red containers on the host and makes a particular user's container to listen on his/her assigned port number, and thereby exposes that port to the user.<br/>After Oauth login, the Application creates a jwt token and resets the token whenever user makes a request to the server(invalidating all the past tokens), thereby achieving high security of user-data.<br/>All in all, the application performs 5 docker operations in various combinations to achieve all its funcitonalities. The operations include- the create, kill, restart methods of the 'dockerode' api & the two versions of 'docker cp' shell-command to transfer data between host and container. Persistance of data includes extracting data from flows.json and package.json files of the container.<br/>The merging functionality of the applicaton is tricky. Node-red assigns unique id's(7-8 character length) to each of it's elements in flows.json to uniquely identify them in a flow. However, two different flows.json files can have one or more id's clashing, threreby simply merging the flows files doesnt actually work and recursive editing of id's(present superficially and also in embedded objects of flows.json) is required. But while iterating through the flows to alter matching id's, the issue arises in ensuring that the altered id's won't be  occuring again in the remaining flows.json files in the iteration. This, via straightforward brute force, can result in O(n^n) time complexity. The algorithm being used in the application, utilizes the fact, that Node-red assigns unique id's to atleast a single flows.json file and smartly manipulates all the id's, achieving the above task of ensuring unique id's, in a time complexity of just O(n)!<br/>Current implementation only allows the user to run a single container at a time on the host.  

## WORKING DEMONSTRATION
Video demo- https://drive.google.com/file/d/1i9_4n4Sxri85eptutktPSd8S9SM4a60l/view?usp=sharing <br/> Website link- https://aviii.me:8443

## FUTURE WORK
Improving the styling of the gui and adding a user's guide, about section in the website. Storing everything in mongo-db and nothing on the host, thereby reading directly from the db and writing to the container without any host intervention. Allowing user to manually restart the container, and have custom nodes installed. Reducing frequency of jwt token-resets, as it's making the site secure but slower!

## PROJECT TEAM
<ul>
<li>Google Summer of Code 2022 Student: Yash Gupta (<a href="https://www.linkedin.com/in/yash-gupta-98a9b1205/">Linkedin</a>)</li><li>Mentor: Manos Tsardoulias (<a href="https://www.linkedin.com/in/manos-tsardoulias-435a7a24/?originalSubdomain=gr">Linkedin</a>)</li><li>Mentor: Konstantinos Panayiotou (<a href="https://www.linkedin.com/in/konstantinos-panayiotou-b8111675/?originalSubdomain=gr">Linkedin</a>)</li><li>Mentor: Andreas Symeonidis (<a href="https://www.linkedin.com/in/andreas-symeonidis-3455843/?originalSubdomain=gr">Linkedin</a>)</li>
</ul>
