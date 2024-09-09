FROM --platform=linux/amd64 node:14.21.3-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
