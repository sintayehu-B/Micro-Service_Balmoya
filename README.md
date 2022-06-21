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
  ![](c:/Users/Fat-Albert/Pictures/AccountService.PNG)

* For the ChatService
  ![](c:/Users/Fat-Albert/Pictures/ChatService.PNG)

* For the JobService
  ![](c:/Users/Fat-Albert/Pictures/JobService.PNG)

* For the Gateway
  ![](c:/Users/Fat-Albert/Pictures/Gateway.PNG)

## Database

- mongoDB Atlas - online database that helps to store the data is being sent from the frontend.

## Reference

-[1] For Code that got as error we fixed it in the website by asking question and see asked question answers : `https://stackoverflow.com/` -[2] for any dependencies installed you could find all the setup here in this url by searching their name list above : `https://www.npmjs.com/`

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

![](c:/Users/Fat-Albert/Pictures/Registre_Company.PNG)

#### individual

![](c:/Users/Fat-Albert/Pictures/Register_Individual.PNG)

### Login

#### Individual

![](c:/Users/Fat-Albert/Pictures/login-empolyee.PNG)

##### Update Individual Profile

- In This profile I am show the password because am trying to show that the password are hashed.
  ![](c:/Users/Fat-Albert/Pictures/profile.PNG)

##### Update changePassword

![](c:/Users/Fat-Albert/Pictures/ChangePassword_employer.PNG)

##### ApplyJob

![](c:/Users/Fat-Albert/Pictures/apply.PNG)

##### PerviousExperience

![](c:/Users/Fat-Albert/Pictures/previous%20experience.PNG)

##### EducationalBackground

![](c:/Users/Fat-Albert/Pictures/educationbackground.PNG)

##### Reference

![](c:/Users/Fat-Albert/Pictures/reference.PNG)

##### Profession

![](c:/Users/Fat-Albert/Pictures/profession.PNG)

##### Report-Users

![](c:/Users/Fat-Albert/Pictures/report.PNG)

##### Get-Verified

![](c:/Users/Fat-Albert/Pictures/get-verified.PNG)

##### Reviews

![](c:/Users/Fat-Albert/Pictures/review.PNG)

#### Organization

![](c:/Users/Fat-Albert/Pictures/Profile_view_employer.PNG)

##### Update Organization Profile

- In This profile I am show the password because am trying to show that the password are hashed.

![](c:/Users/Fat-Albert/Pictures/Update_employer_Profile.PNG)

##### Update changePassword

![](c:/Users/Fat-Albert/Pictures/ChangePassword_employer.PNG)

##### JobPost

![](c:/Users/Fat-Albert/Pictures/JobPosting_employer.PNG)

###### Update JobPost

![](c:/Users/Fat-Albert/Pictures/updating_jobpost-employer.PNG)

###### Delete JobPost

![](c:/Users/Fat-Albert/Pictures/deleting_jobPOost.PNG)

###### Get single JobPost by created user only

![](c:/Users/Fat-Albert/Pictures/getting_jobPost_off_logged%20in%20user.PNG)

#### conversation

![](c:/Users/Fat-Albert/Pictures/conversation.PNG)

#### messaging

- Sender
  ![](c:/Users/*Fat-Albert/Pictures/messageing%20between%20users.PNG)

- Responder

![](c:/Users/Fat-Albert/Pictures/responder%20messager.PNG)

### Admin

#### Get All Users

![](c:/Users/Fat-Albert/Pictures/get%20all%20user.PNG)

#### Get All JobPosted

![](c:/Users/Fat-Albert/Pictures/get%20all%20jobpost.PNG)

#### Get ID JobPosted

![](c:/Users/Fat-Albert/Pictures/getting%20all%20jobposted%20by%20id.PNG)

#### Banning User

![](c:/Users/Fat-Albert/Pictures/banning%20user.PNG)

#### UnBanning User

![](c:/Users/Fat-Albert/Pictures/unbanning%20user.PNG)

#### Delete User

![](c:/Users/Fat-Albert/Pictures/delete%20user.PNG)

#### Verify user

![](c:/Users/Fat-Albert/Pictures/verify.PNG)

#### UnVerify User

![](c:/Users/Fat-Albert/Pictures/unverify.PNG)
