# This is derived from Base Image  node:boron
FROM  node:boron
# FROM dockerfile/nodejs-bower-grunt
LABEL maintainer Abhishek Ghosh

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 8888
CMD [ "npm", "start" ]
