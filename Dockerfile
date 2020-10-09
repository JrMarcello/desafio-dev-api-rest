FROM node:alpine

WORKDIR /usr/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npx apidoc -i ./src/modules/**/ -o ./public/api

EXPOSE 3000

CMD ["npm", "run", "server"]