# Ink Multisig Squid Shibuya

## Getting Started

### 🚀 How to run the squid

> 🚨🚨🚨 Creating the .env file is essential for running the application. The required variables will vary depending on whether you are running the application locally or using Docker.

- Clone the repository with the following command and enter the project folder:

```bash
git clone https://github.com/0xLucca/ink-multisig-squid-shibuya.git && cd ink-multisig-squid-shibuya
```
#### A. With Docker

- ⚠️ Requirements:
  - docker
  - docker-compose

1. Make sure your daemon `docker` is running in your system.

2. Before building the docker image and running it with docker-compose, you need to configure the necessary environment variables. Start by copying the .env.example file to .env and customize the variables to suit your requirements:

```
DB_NAME=squid
DB_HOST=db
DB_PASS=postgres
EXTERNAL_DB_PORT=23798
EXTERNAL_GQL_PORT=4350
EXTERNAL_PROMETEUS_PORT=3000
```

> Feel free to modify these variables to match your specific configuration.

3. Once the environment variables are set, you can proceed to build the Docker image and launch the squid using Docker Compose:

```bash
# Build the Docker image
docker build . -t ink-multisig-squid-shibuya

# Run the application in detached mode
docker-compose -f docker-compose-prod.yml up -d
```

✋ To stop the running containers, use the following command:

```bash
docker-compose -f docker-compose-prod.yml down
```

> You can access the GraphQL playground at http://localhost:4350/graphql. If you change the EXTERNAL_GQL_PORT variable in the .env file, make sure to use the new port in the URL.

#### B. Local Stack

- ⚠️ Requirements:
  - node
  - npm

1. Install @subsquid/cli a.k.a. the sqd command globally
```bash
npm i -g @subsquid/cli
```

2. Install dependencies
```bash
npm ci
```

3. Configure the environment variables. Copy the .env.example file to .env and customize the variables as needed. For local execution, the required environment variables are:
```
DB_NAME=squid
DB_PASS=postgres
EXTERNAL_DB_PORT=23798
```
> Adjust these variables to match your local development environment.

4. Start a Postgres database container and detach
```bash
sqd up
```

5. Start the processor
```bash
sqd process
```
> The command above will block the terminal being busy with fetching the chain data, transforming and storing it in the target database.

6. To start the graphql server open a new terminal and run
```bash
sqd serve
```

> You can access the GraphQL playground at http://localhost:4350/graphql

