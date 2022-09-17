# gsoc2022--Nodered-WebApp-

## BASE IDEA
NodeRed is one of the most well known low-code IoT programming tools, offering a large number of ready-to-use libraries. Nevertheless, it lacks modern aspects of system deployments, like multi-user server functionalities, since one NodeRed deployment can support only one user. In this context we propose a web application written in NodeJs, that will provide a web-based interface, via which the management (creation, deletion and deployment) of NodeRed instances will be performed. Each NodeRed instance will be deployed using Docker. Furthermore, the system will support saving annotated NodeRed deployments which contain specific nodes (or flows), so as to easily create new deployments that offer personalized/aggregated functionality. E.g. if a user creates flows annotated as "Raspberry Pi GPIO" and another creates "Google Firebase", the system should be able to create a new NodeRed instance that contains one of these flow sets or both, according to what the end user needs.

## FINALIZED USE-CASES
-Users will be able to sign-in/sign-up via Google Oauth.<br/>
-Users can create a "fresh" Node-Red instance(technically, deploy a docker container on server for themselves), and then can save their work by providing an "annotation" & "accessibility"(public/private) before killing their instance.<br/>
-Users can access other people's (public)work, and create a "cloned" Node-Red instance, which could also be a merged-product of multiple instances, depending upon the number of instances, the user selected to be cloned.<br/>
-The user is currently allowed to only fire up one container at a time on the server. He/She is required to stop a currently running instance to be able to fire up a new one. 

## INTERFACE
Upon login, the user is shown his/her dashboard, which has two lists- "User Deployments" & "Others Deployments". The User-list allows user to select none/one instance to create fresh/ clone a past or delete a past annotation respectively. The Others-list also allows user to do all that, except the deleting option. The Others-list also allows user to select multiple instances at a time while cloning, hence deploy one instance, containing all the flows/works he/she chose from the list. Apart from the two lists there is also a logout button available.

## TECH STACK USED
MERN stack, Docker, AWS EC2 host.

## CURRENT IMPLEMENTATION

## FUTURE WORK
