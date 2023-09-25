

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
  "message": "Registration successful",
  "user": {
    "message": "Signup was successful",
    "user": {
      "id": 11,
      "email": "asad92@gmail.com",
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


