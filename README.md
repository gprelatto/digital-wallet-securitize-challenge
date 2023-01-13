# Digital Wallet Challente
This is a challenge for securitize.io
The main goal is to build a generic platform that return analytics on Ethereum wallets.

## FrontEnd

### Technology
* NextJS
* React
* MaterialUI
* Axios
* TypeScript

### How to start it?

1. Install Packages
  ```sh
  npm install
  ```
2. Build the Project
  ```sh
  npm run build
  ```
3. Start Project
  ```sh
  npm start
  ```

### ENV Variables
  
```sh
NEXT_PUBLIC_API_URL= database API URL
```

## Backend

### Technology

* NestJS
* TypeORM
* TypeScript
* Etherscan

### ENV Variables
  
In order to use them, you shoud add the .env file inside src/common/envs/
  
```sh
PORT= database port
BASE_URL= api base URL
DATABASE_HOST= database server 
DATABASE_NAME= database name
DATABASE_USER= database user
DATABASE_PASSWORD= database password
DATABASE_PORT= database port
DATABASE_SCHEMA= database schema
DATABASE_SYNC= enable or disable database sync (use on false)
DATABASE_RUN_MIGRATIONS= enable or disable run migrations (use true)
DATABASE_MIGRATIONS_TABLE_NAME= migrations table name (use migration)
ETHERSCAN_API_KEY= api key from etherscan
```

### How to start it?
1. Install Packages
  ```sh
  npm install
  ```
2. Run Migrations
  ```sh
  npm run typeorm:run-migrations
  ```
3. Start Project
  ```sh
  npm run start:dev
  ```

## Swagger / Api Doc

If you want to try out the API, you can access to a swagger instance I created under the following path:

  ```sh
  http://URL:3001/digital-wallet-backend
  ```


## Docker Compose

In case you want to run it Dockerized, I included a docker compose file that will:

1. Create an instance of Postgres (locally accessible under port 5433)
2. Run the frontend APP under port :3000
3. Run the backend APP under port :3001

### How to start it?

Simply run the following command:

  ```sh
  docker-compose up -d
  ```
Note: It takes a while to download all dependencies, please be patient :) 