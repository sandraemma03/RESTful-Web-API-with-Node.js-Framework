# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

In this project, I have made use of  [Hapi](https://hapijs.com/) nodejs framework. 

### Configuring your project

- Use NPM to install all packages and dependencies in the package.json file to get you up and running. The following command will do in a command prompt:
```
npm install
```
- Next, you will need to run npm start to start the server as shown below
```
npm start
```

## Testing
- To test the API, we are going to use [CURL](https://curl.haxx.se/) which is a command-line tool used to deliver requests supporting a variety of protocols like HTTP, HTTPS, FTP, FTPS, SFTP, and many more. So, to proceed, you should open another command prompt and type the following to test the `Get Block`.

```
curl "http://localhost:8000/block/0"
```

and

```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json' \
     -d $'{
  "body": "Testing block with test string data"
}'
```
to test the `Post Block`. 