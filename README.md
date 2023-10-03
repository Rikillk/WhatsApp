

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# REST API

The REST API to the example app is described below.

## User SignUp

### Request

`/api/auth/signup`

curl -X 'POST' \
  'http://localhost:3001/api/auth/signup' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
"username":"asad",
"email":"asad92@gmail.com",
"password":"asad1234"
}'
### Response

 {
  "message": "Registration successful",\
  "user": {\
    "message": "Signup was successful",\
    "user": {\
      "id": 11,\
      "email": "asad92@gmail.com",\
      "username": "asad"
    }
  }
}


## User SignIn

### Request

`/api/auth/signin`


curl -X 'POST' \
  'http://localhost:3001/api/auth/signin' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
"email":"manver23@gmail.com",
"password":"manu@45"}'

### Response
{
  "message": "Logged in successfully",\
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibWFudmVyMjNAZ21haWwuY29tIiwiaWF0IjoxNjk1NDU3MzIzfQ.shIm5Rmo5Wm58Sldcb_ZpgA_ursMsBMohQHDPN6Ejik"
}
## User SignOut

### Request

`/api/auth/signout`


curl -X 'GET' \
  'http://localhost:3001/api/auth/signout' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoibWFudmVyMjNAZ21haWwuY29tIiwiaWF0IjoxNjk1NDU3MzIzfQ.shIm5Rmo5Wm58Sldcb_ZpgA_ursMsBMohQHDPN6Ejik'\
### Response
{
  "message": "Signed out successfully"
}
## Offensive-message-analysis with AI

### Request

`/api/messages/analyze-offensive`

curl -X 'POST' \
  'http://localhost:3001/api/messages/analyze-offensive' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '
{"message":"How are you?"
}'
### Response
{
  "isOffensive": false
}
## Sending Welcome e-mail on Successful SignUp

### Request

`/api/email/sendemail`

curl -X 'POST' \
  'http://localhost:3001/api/email/sendemail' \
  -H 'accept: */*' \
  -d ''
### Response
{
  "message": "Welcome mail sent"
}
## Registering through Google
### Request

`/api/auth/google/login`

curl -X 'GET' \
  'http://localhost:3001/api/auth/google/login' \
  -H 'accept: */*'
### Response
{
  "message": "Google Authentication"
}
## Creating a Group
### Request

`/api/groups`

curl -X 'POST' \
  'http://localhost:3001/api/groups' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{"name":"School wale",
"members":[7,8,9,10]
}'
### Response
{
  "id": 4,
  "name": "School wale"
}

## Add a member to a Group
### Request

`/api/groups/{groupId}/members`

curl -X 'PUT' \
  'http://localhost:3001/api/groups/3/members' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{"userId":6}'
### Response
{
  "groupName": "friends",\
  "memberNames": [
    "ashish",
    "ANSHU",
    "Rikill Kumar",
    "rikhil kumar"
  ]
}
## Get a list of members of a Group
### Request

`/api/groups/{groupId}/members`

curl -X 'GET' \
  'http://localhost:3001/api/groups/2/members' \
  -H 'accept: */*'
### Response
[
  {
    "id": 2,
    "name": "ashish"
  },\
  {
    "id": 3,
    "name": "ANSHU"
  },\
  {
    "id": 4,
    "name": "rahul"
  }
]
## Send Message to a Group via WebSockets

### Request

`/api/groups/{groupId}/messages`

curl -X 'POST' \
  'http://localhost:3001/api/groups/2/messages' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{"content":"hello",
"senderId":3,"groupId":2}'

### Response

{
  "id": 57,\
  "content": "hello",\
  "senderId": 3,\
  "groupId": 2,\
  "createdAt": "2023-09-29T07:54:30.148Z"
}
## Mute a Group

### Request

/api/groups/{groupId}/mute

curl -X 'PUT' \
  'http://localhost:3001/api/groups/1/mute' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{"userId":11,
"muteUntil":"2023-10-04T07:54:30.148Z"}'

## Response

### If not a Group Member
{
  "message": "Group member not found.",
  "error": "Not Found",
  "statusCode": 404
}
