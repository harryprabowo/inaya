# `inaya-server`

This package is the backend module for Inaya system.

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

    $ npm install -g yarn

---

## Install

Install as has been explained in the project root, or you can see this StackOverflow's [answer](https://stackoverflow.com/a/52269934/2988) for cloning subdirectory.

## Configure app

Grab `BACKEND ENVIRONMENT VARIABLES` from this project's root, then create a `.env` file in your root directory for `inaya-server`. Personalize your configuration.

## Running the project

    $ yarn start

## Simple build for production

    $ yarn build

## API

Full API documentation [here](https://app.swaggerhub.com/apis-docs/ahmadnaufalhakim/INAYA/1.0.0).

## Tests

No tests implemented.

## Contributors

Team LOGISTIC-1 @ 2020, ITB, Inc. or its affiliates.

## License

The MIT License (MIT)

Copyright © 2020 Team LOGISTIC-1
