# Intro

This is a React front-end for the [stream monitor](https://github.com/HighTechHarmony/StreamMonitor).

Dependencies:

- [stream monitor](https://github.com/HighTechHarmony/StreamMonitor)
- It also needs the [express API submodule](https://github.com/HighTechHarmony/StreamMonitor_Express_API)

# Quick start for testing with webpack

Install the required modules:
`npm install`

Run this to test the react front end
`npm run start`

Run this to generate the necessary files for your front-end web host:
`npm run build`

And [hit with a browser on port 5000](http://localhost:5000) (if you haven't adjusted the port)

If you this is being run on a different host than your browser, and you get an error page that says `Invalid host header`,you'll most likely need to create a .env file containing:

```
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

# Generic instructions for Create-React-App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
