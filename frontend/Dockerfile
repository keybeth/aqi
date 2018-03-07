FROM node:boron

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install && \
	npm build

# Bundle app source
COPY public public

EXPOSE 9000
CMD [ "npm", "start" ]