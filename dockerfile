FROM node:11

# Create app directory
WORKDIR /app

# Install app dependencies package.json, yarn.lock, tsconfig.json
COPY package.json yarn.lock tsconfig.json ./app/

# Bundle app source
COPY . /app

# Install app dependencies
RUN npm install

# Build app
RUN npm build

# Expose port
EXPOSE 3000

#start app
CMD ["npm", "start"]
