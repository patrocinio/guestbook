FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN apk add --update python make gcc g++
RUN npm install
RUN ln -s /opt/mqm/lib64/libmq* /usr/lib/
COPY server.js backend.js redisHelper.js queue.js /usr/src/app/

EXPOSE 8080
CMD ["npm", "start"]
