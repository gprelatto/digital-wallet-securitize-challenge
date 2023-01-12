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

## Backend

### Technology

* NestJS
* TypeORM
* TypeScript
* Etherscan

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
