# React Native image upload/display with Amazon S3 using AWS Amplify

<img width="1167" alt="layout" src="https://user-images.githubusercontent.com/26605247/54386524-0afbff00-4691-11e9-8f5c-a940da89e5cd.png">

This project integrates a React Native front-end with an AWS Amplify back-end that has user authentication (AWS Cognito) and the Storage API from AWS Amplify. This configuration allows us to perfomr CRUD operations to interact with Amazon S3 from our React native front end.

## App Overview

* Users can sign up/in to the app.

* Users can upload pictures by pressing the add button.

* Users can delete pictures by pressing the trash button.

* Users can update the feed by pressing the reload button. 

## Prerequisites

* [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)
  * `npm install -g expo-cli`
  
* [AWS account](https://aws.amazon.com/amplify/)

* [Node JS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

* [AWS Amplify CLI](https://aws-amplify.github.io/)
  * `npm install -g @aws-amplify/cli`
  * `amplify configure` ([link](https://www.youtube.com/watch?v=fWbM5DLh25U) for a step by step video).

## Configuring the project

1. Clone this repo to your local machine.

```
git clone https://github.com/jtaylor1989/react-native-s3.git

cd react-native-s3
```

2. Add AWS Amplify dependencies to your project.

```
yarn add aws-amplify aws-amplify-react-native

# or

npm install aws-amplify aws-amplify-react-native
```

3. Initialise the AWS Amplify project.

```
amplify init
```

Follow the same instructions as below.

<img width="561" alt="init" src="https://user-images.githubusercontent.com/26605247/54110565-98152e80-43d9-11e9-9eed-e728cbf2ecd6.png">

4. Configure an Amazon Cognito User Pool to store users credentials.

```
amplify add auth

# When prompt, choose: Yes, use the default configuration.
```

5. Add an Amazon S3 bucket to store pictures.

```
amplify add storage

# Choose: Content (Images, audio, video, etc.)
# Give access to only authenticated users.
# Give users read/write acces.
```

6. Time to deploy your project to AWS.

```
amplify push
```

<img width="473" alt="cloudformation" src="https://user-images.githubusercontent.com/26605247/54111473-d7447f00-43db-11e9-9fe8-57edd0a36fe8.png">

After few minutes of automated operations, the Amplify CLI will create an Amazon Cognito User Pool and Identity Pool to store users crendentials and an AWS AppSync GraphQL API to allow for CRUD operations between client and servers.

## Running the application

1. Install client dependencies.

```
yarn

# or

npm install
```

2. Launch the React Native app in your simulator under your project directory.

```
expo start --ios

# or

expo start --android
```

## Contribute

* Feel free to contribute to this project.
