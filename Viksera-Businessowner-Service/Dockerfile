FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy all of the application code
COPY package.json /app/

RUN npm install

RUN npm install -g pm2

COPY . .

EXPOSE 8000

CMD ["pm2-runtime", "start", "src/index.js"]
