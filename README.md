# Inaya Aid Logistics

## Overview

Humanitarian aid logistics in Inaya consist of:

- **Droppoint** - hotspot for supply request.
- **Facility** - supply inventory management (_assets is `TBD`_).
- **Shipment** - delivery schedule & routing (_tracking is `TBA`_).

Inaya is a (web) app that allows droppoints and facilites to interact & manage aid supply logistics.

Here's a typical use case on Inaya.

1. _Facility_ registers for aid supply inventorism.  
   Admin then sets shipment dispatch schedules.
2. Suppliable candidates are submitted for verification.\*  
   Verified suppliables can be listed in inventory.
3. _Droppoint_ submits a droppoint for verification.\*  
   Verified droppoints can request for supplies.
4. Nearest _facilities_ listing the supplies are committed to the request.  
   _Droppoint_ can monitor shipment status & details.
5. Arrived supplies are consigned by _droppoint_.\*

> \*For development purposes, several processes are simulated.

Verification method is `TBD` - current opinion is to have it performed by the superadmin role.

## Details

This project uses:

- [`create-react-app`](https://github.com/facebook/create-react-app) React template with the following modifications.
  - [`react-app-rewired`](https://github.com/timarney/react-app-rewired)
  - [`customize-cra`](https://github.com/arackaf/customize-cra)
- [`express-generator`](https://github.com/expressjs/generator) generated Express template with Pug viewer and [`nodemon`](https://github.com/remy/nodemon).

This project uses `Yarn v2 workspaces`. See [Yarn v2 documentation](https://yarnpkg.com/features/pnp) for details.

Frontend & backend are separate workspaces with their own `package.json`, located in `/packages/`. This project when locally run will concurrently start the `client` (frontend) and `server` (backend) workspaces. However, each one will be mounted as their own services in Docker.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Issues](#issues)
- [Support](#contributing)
- [Contributing](#contributing)
- [History](#history)
- [Credits](#credits)
- [License](#license)

## Installation

**Make sure you have [Yarn](https://github.com/yarnpkg/yarn) installed.**

1. Clone this project

```
$ git clone https://github.com/harryprabowo/fullstack-cra-boilerplate
```

2. Open a terminal at project root and install dependencies.  
   Please note that `docker-compose build` **are set to fail** if this is not done in advance.

```
$ yarn
```

3. Clone `ENV.SAMPLE` and rename to `.env`. Restart any running instances.  
   Generate your own `API_KEY` for OSM API.  
   Generate your own 64bit `JWT_SECRET` [here](https://www.grc.com/passwords.htm).

### Docker

To use with Docker, build.

```
$ docker-compose build
```

Also remember to first **seed & migrate** the database with (the commands in the) `Makefile`.

> Mounting `Makefile` to database volume on Docker is `WIP`.

## Usage

Start the project.

```
$ yarn start
```

`yarn start` is configured with [`concurrently`](https://github.com/kimmobrunfeldt/concurrently) to run `client` and `server` workspaces - concurrently.

You can also run each workspaces independently.

```
$ yarn workspace <workspace-name> start
```

To run scripts for independent workspaces, use:

```
$ yarn workspace <workspace-name> <script>
```

### Docker

To use with Docker, simply run after building.

```
$ docker-compose up
```

If package is modified, rebuild to apply changes.

```
$ docker-compose up --build
```

Make sure `yarn.lock` is final before building. Difference in `yarn.lock` in the container and the source will cause the build to fail. This is purposely done to conserve cache between host & containers.

### Issues

#### Installation & Usage

- Make sure package changes are done at project root. Doing it in respective workspaces can fail to cascade. Or simlpy remember to `yarn install` at project root before rebuilding on Docker.
- Some packages does not work when installed for a workspace only, and has to be installed globally across workspaces (even if it's required only by one workspace). Simply reinstall at the root.

  ```
  $ yarn add <package-name>
  ```

  Do not remove dependency from the local workspace. or else the dependency will be **ambiguous**. Here are the packages in question.

  - `classnames @2.2.6`
  - `node-sass @4.14.1`
  - `pg @8.1.0`
  - `prop-types @15.7.2`
  - `pug @2.0.4`

- Sometimes `yarn install` can fail for no reason. Please try again. If the next try didn't succeed, look at the next poin.
- This project's `Dockerfile` uses multistage building to conserve cache between host & containers. However some dependencies **are not cross-platform compatible**, and has to be manually reinstalled. Here are the packages in question.

  - [~~`bcrypt`~~](https://github.com/kelektiv/node.bcrypt.js) - Migrated to an alternative with no dependency ([`bcryptjs`](https://github.com/dcodeIO/bcrypt.js)).
  - [`node-sass`](https://github.com/sass/node-sass)

  If package binding error occurs, remove & add packages again.

  ```
  $ yarn remove <package-name> -A
  $ yarn add <package-name>
  ```

  Prepend with `docker exec <package-container>` on Docker.

- If irrecoverable error occured, do the following.
  ```
  $ yarn cache clean
  $ yarn install
  ```
  And if you're on Docker:
  ```
  $ docker-compose up --force-recreate
  ```

## Support

Please [open an issue](https://github.com/harryprabowo/inaya/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/harryprabowo/inaya/compare/).

## History

Version 0.1 (2020-05-09) - Migrating from old codebase at Gitlab, implemented `Yarn v2 workspaces` [boilerplate](https://github.com/harryprabowo/fullstack-cra-monorepo-boilerplate).

## Credits

Team LOGISTIC-1 @ 2020, ITB, Inc. or its affiliates.

## License

The MIT License (MIT)

Copyright © 2020 Team LOGISTIC-1
