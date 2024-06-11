#!/bin/bash

# Add Azure remote repository
git remote add azure https://onerupee-store-api-stage.scm.azurewebsites.net:443/onerupee-store-API-stage.git

# Switch to the prod branch
git checkout dev

# Pull the latest changes from the prod branch
git pull origin dev

# Other commands for building and preparing your application for deployment
# Example:
# npm install
# npm run build

# Push the changes to the Azure remote repository (assuming prod branch is mapped to master on Azure)
git push azure dev:master