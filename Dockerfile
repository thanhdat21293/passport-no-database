FROM node:7.7.4-alpine

#Create app directory
#RUN apt-get remove docker docker-engine
#RUN apt-get install docker-ce
RUN mkdir -p /usr/src/abc
WORKDIR /usr/src/abc
COPY . /usr/src/abc
EXPOSE 3000
RUN npm install
CMD ["node", "index.js"]
