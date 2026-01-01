# Express Project Initial Setup Checklist

## Setup Tasks

- [ Done ] Git setup
- [ Done ] Node.js version manager setup [nvm install (if not install) , nvm use (this command use the .nvmrc version)]
- [ Done ] Node.js project setup [npm init]
- [ Done ] TypeScript setup [npm i -D typescript,npx tsc --init(create tsconfig.js) , npm i -D @types/node ]
- [ Done ] Prettier setup [ npm install --save-dev --save-exact prettier , npx prettier . --write ]
- [ Done ] Eslint setup [npm install --save-dev eslint @eslint/js typescript-eslint , "lint:fix": "npx eslint . --fix",
  "lint:check": "npx eslint ."]
- [ Done ] Git hooks setup [npm install --save-dev husky ,npx husky init , npm install --save-dev lint-staged (Used for only staged file checked) ]
- [ Done ] Application config setup [npm i dotenv]
- [ Done ] Express.js app setup
- [ Done ] Logger setup [npm i winston , and the order is like this ({
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
  })]

- [ Done ] Error handling setup [npm i http-errors]
- [ Done ] Tests setup [npm install --save-dev jest, npm install --save-dev ts-jest , npx ts-jest config:init, npm install --save-dev @types/jest, npm i supertest, npm i -D @types/supertest ]
- [ Done ] Create template [git remote add template git@github.com-first:KoushikPanda1729/microservice_template.git , git push template main]

## mongodb Tracking

create volume ---> docker volume create catalog-service-mddata

Run container ---->  
 docker run -d \  
 --name mongodb-catalog-service \
 -p 27017:27017 \
 -v catalog-service-mddata:/data/db \
 -e MONGO_USERNAME=root \
 -e MONGO_PASSWORD=root \
 mongo
