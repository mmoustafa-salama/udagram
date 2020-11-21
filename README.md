# Udagram

Udagram is a simple Instagram-like serverless cloud application developed along side the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/mmoustafa-salama/udagram/tree/master/frontend)
A basic Ionic client web application which consumes the Backend API. 
2. [The Backend API](https://github.com/mmoustafa-salama/udagram/tree/master/backend), a serverless service which can be deployed to AWS.
***

## Getting Setup

> _tip_: this frontend is designed to work with [The Backend API](https://github.com/mmoustafa-salama/udagram/tree/master/backend). It is recommended you stand up the backend first, test using Postman, and then the frontend should integrate.

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing Ionic Cli
The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```bash
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

### Configure The Backend Endpoint
Ionic uses enviornment files located in `./src/enviornments/enviornment.*.ts` to load configuration variables at runtime. By default `environment.ts` is used for development and `enviornment.prod.ts` is used for produciton. The `apiHost` variable should be set to your backend API url.

***
### Running the Development Server
Ionic CLI provides an easy to use development server to run and autoreload the frontend. This allows you to make quick changes and see them in real time in your browser. To run the development server, open terminal and run:

```bash
ionic serve
```

### Building the Static Frontend Files
Ionic CLI can build the frontend into static HTML/CSS/JavaScript files. These files can be uploaded to a host to be consumed by users on the web. Build artifacts are located in `./www`. To build from source, open terminal and run:
```bash
ionic build
```
***

## Features
1. Register
2. Login
3. Post an image to the newsfeed
4. Listing the posts


## Features to be implemented
1. Edit post
2. Remove post
3. Add/Edit/Delete comments 
4. Like/Unlike posts
5. Search users
6. Follow/Unfollow users
7. Add UI improvements 


## Postman collection
[Udagram.postman_collection.json](https://github.com/mmoustafa-salama/udagram/tree/master/backend/Udagram.postman_collection.json)