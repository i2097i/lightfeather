
> Note: Run the following from the `lightfeather-client` root directory.

# Run locally

`npm install && npm start`

# Run in Docker

### Build image
`docker build .`
### Run image 
`docker run -p 3000:3000 -d $DOCKER_IMAGE_ID`
### List Containers
`docker ps`
### List Images
`docker images`
