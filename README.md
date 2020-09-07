# New Jersey DOL Eligibility Tool

## Context
This project is a fork of [the USDR's PAPUA prototype](https://github.com/usdigitalresponse/project-papua).

For more information on that project, see [their Wiki](https://github.com/usdigitalresponse/project-papua/wiki).

## Getting Started
Follow these steps to run the application locally:

1. `yarn install` - this installs all required dependencies
1. `yarn start` - this utilizes `react-scripts` to start a development server with hot module reloading

## Deploying
This application is deployed and served using [Github Pages](https://pages.github.com/). To deploy this application, run the following commands in order.

**NOTE: it is critical that these commands are only run on the main branch - otherwise you will overwrite the production environment with any changes from your current branch**

1. `yarn predeploy` - this generates a production-ready build with the NJ DOL public url
1. `yarn deploy` - this runs the `gh-pages` cli to upload the `build` directory generated in the previous step to the `gh-pages` branch in this repository, targeting the `labor` directory. The repository settings are targeting this `gh-pages` branch as the source for Github Pages hosting.
