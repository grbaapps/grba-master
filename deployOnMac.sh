echo "Create the docker file"
#!/usr/bin/env bash
set -e

# remove dist
rm -rf grbaweb

imageName=grbaweb

# remove dist
rm -rf ${imageName}

baseimage="node:boron"
workdir="./${imageName}"

# Create workdir
mkdir ${imageName}
cd ${imageName}

# Create Dockerfile
echo "# This is derived from Base Image " $baseimage>> Dockerfile


# Import base image
echo "FROM " $baseimage >> Dockerfile

#Assign team label
echo "LABEL maintainer Abhishek Ghosh" >> Dockerfile

# 
echo "" >> Dockerfile

# Create app directory
echo "RUN mkdir -p /usr/src/app" >> Dockerfile
echo "WORKDIR /usr/src/app" >> Dockerfile

# Install app dependencies
echo "COPY package.json /usr/src/app/" >> Dockerfile
echo "RUN npm install" >> Dockerfile

# Bundle app source
echo "COPY . /usr/src/app" >> Dockerfile

echo "EXPOSE 8888" >> Dockerfile
echo "CMD [ \"npm\", \"start\" ]" >> Dockerfile

cp Dockerfile ..

echo "Dockerfile CREATED"


echo "Create image and deploy to local. make sure Docker daemon is up and running"

echo "clean work directory for git clone"
rm -rf ./grba-master

# clone and build app
git clone https://github.com/abhiunc/grba-master

# enable proxy if needed
# npm config set https-proxy http://{username}:{password}@{proxy_host}:{proxy_port}
# npm config set proxy http://{username}:{password}@{proxy_host}:{proxy_port}

# install packages for server
cd grba-master/server
npm install

# install packages for client
cd ../client
grunt build

echo "app built"

# move out of devexchange directory
pwd
cd ..

if [[ $(docker ps --filter=name="grbaweb") == *"grbaweb"* ]]; then
echo "stop grbaweb"
 docker stop grbaweb
fi

if [[ $(docker ps --filter=status=exited --filter=status=created) == *"grbaweb"* ]]; then
echo "clean stopped containers"
 docker rm $(docker ps --filter=status=exited --filter=status=created -q)
fi

echo "build"
docker build --no-cache=true -t grbaweb:latest .

if [[ $(docker ps --filter=name="grbaweb") == *"grbaweb"* ]]; then
echo "stop grbaweb"
 docker stop grbaweb
fi

if [[ $(docker ps --filter=status=exited --filter=status=created) == *"grbaweb"* ]]; then
echo "clean stopped containers"
 docker rm $(docker ps --filter=status=exited --filter=status=created -q)
fi

echo "run the image"
docker run  -d -p 8888:8888 --name grbaweb grbaweb

echo "service deployed"


