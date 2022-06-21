# Project Title

Balemoya

## Description

- The Balemoya system aims to create a platform that helps people look for jobs and employment opportunities in their area of expertise. Multiple separate subsystems and heterogeneous clients make up the system, which includes admin dashboard in web version and mobile application clients.

## Getting Started

### Dependencies

- express, axios, bcrypt , body-parser , cors ,dotenv, helmet , moment , mongoose , passport , passport-jwt , jsonwebtoken , method-override , socket.io ,express-http-proxy , nodemon

### Installation

- browse into your projects directory: `cd ~/YOUR_PROJECTS_DIRECTORY`

- Clone this repository : `https://github.com/sintayehu-B/Micro-Service_Balmoya`

- browse into the project directory: `cd ~/accountService , chatService, jobService, gateway`

- Install the dependencies: `npm install || npm i`

### Executing Program

- browse into the project directory: `cd ~/accountService , chatService, jobService, gateway`

- Start the projects : `npm start`

* For the AccountService
  <img src="/screenShots/AccountService.PNG" width="500">

* For the ChatService
  ![](c:/Users/Fat-Albert/Pictures/ChatService.PNG)
  <img src="/screenShots/ChatService.PNG" width="500">

* For the JobService
  ![](c:/Users/Fat-Albert/Pictures/JobService.PNG)
  <img src="/screenShots/JobService.PNG" width="500">

* For the Gateway
  ![](c:/Users/Fat-Albert/Pictures/Gateway.PNG)
  <img src="/screenShots/Gateway.PNG" width="500">

## Database

- mongoDB Atlas - online database that helps to store the data is being sent from the frontend.

## Reference

-[1] For Code that got as error we fixed it in the website by asking question and see asked question answers : `https://stackoverflow.com/`

-[2] for any dependencies installed you could find all the setup here in this url by searching their name list above : `https://www.npmjs.com/`

- for the chat referenced from this youtube video : `https://www.youtube.com/watch?v=HggSXt1Hzfk&list=PLj-4DlPRT48lXaz5YLvbLC38m25W9Kmqy&index=4`

## Team Members

- Abiy menberu ATR/2705/11
- Bisrat Fekede ATR/0929/11
- Dan Mekonnen ATR/8274/11
- Sintayehu Sermessa ATR/8798/11

## Advisor

- Mrs. Salem Getachew

## Summary About The Balemoya MicroService Api

- AccountService, ChatService, and JobService are three services that communicate with one another, and to regulate the flow of the route, we built a gateway to read those requests and send them to the proper service, with the service handling the request send.

- All the service handle the get, post ,delete, put or patch, functionalities.

- All the service has to start by using `npm start` as show in the above to get the all functionalities. and most off them all the gateway has to be running because all the service route are handled
  through the gateway port 8000 to access the other service respect to the routes.

- All the service has dependencies with one another the database has duplication of some data in other service because this is one of microservice drawbacks.

## Testing With POSTMAN

### Registration

#### Organization

<img src="/screenShots/Registre_Company.PNG" width="500">

#### individual

<img src="/screenShots/Register_Individual.PNG" width="500">

### Login

#### Individual

<img src="/screenShots/login-empolyee.PNG" width="500">

##### Update Individual Profile

- In This profile I am show the password because am trying to show that the password are hashed.
  <img src="/screenShots/profile.PNG" width="500">

##### Update changePassword

<img src="/screenShots/ChangePassword_employer.PNG" width="500">

##### ApplyJob

<img src="/screenShots/apply.PNG" width="500">

##### PerviousExperience

<img src="/screenShots/previous experience.PNG" width="500">

##### EducationalBackground

<img src="/screenShots/educationbackground.PNG" width="500">

##### Reference

<img src="/screenShots/reference.PNG" width="500">
##### Profession
<img src="/screenShots/profession.PNG" width="500">

##### Report-Users

<img src="/screenShots/report.PNG" width="500">

##### Get-Verified

<img src="/screenShots/get-verified.PNG" width="500">

##### Reviews

<img src="/screenShots/review.PNG" width="500">

#### Organization

##### Update Organization Profile

<img src="/screenShots/Profile_view_employer.PNG " width="500">

- In This profile I am show the password because am trying to show that the password are hashed.

##### Update changePassword

<img src="/screenShots/ChangePassword_employer.PNG" width="500">

##### JobPost

<img src="/screenShots/JobPosting_employer.PNG" width="500">

###### Update JobPost

<img src="/screenShots/updating_jobpost-employer.PNG" width="500">

###### Delete JobPost

<img src="/screenShots/deleting_jobPOost.PNG" width="500">

###### Get single JobPost by created user only

<img src="/screenShots/getting_jobPost_off_logged in user.PNG" width="500">

#### conversation

<img src="/screenShots/conversation.PNG" width="500">

#### messaging

- Sender
  <img src="/screenShots/messageing between users.PNG" width="500">

- Responder
  <img src="/screenShots/responder messager.PNG" width="500">

### Admin

#### Get All Users

<img src="/screenShots/get all user.PNG" width="500">

#### Get All JobPosted

<img src="/screenShots/getting all jobposted by id.PNG" width="500">

#### Get ID JobPosted

<img src="/screenShots/getting all jobposted by id.PNG" width="500">

#### Banning User

<img src="/screenShots/banning user.PNG" width="500">

#### UnBanning User

<img src="/screenShots/unbanning user.PNG" width="500">

#### Delete User

<img src="/screenShots/delete user.PNG" width="500">

#### Verify user

<img src="/screenShots/verify.PNG" width="500">

#### UnVerify User

<img src="/screenShots/unverify.PNG" width="500">
