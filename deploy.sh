#!/bin/bash

set -e

# Build the app
npm install

npm run build

npm run start