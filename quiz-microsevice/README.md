## Running the Quiz Microservice and MongoDB with Docker and Docker Compose

This guide provides clear instructions for setting up and running the Quiz Microservice along with MongoDB using Docker and Docker Compose.

### Prerequisites

Ensure you have the following installed:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

Start by cloning the repository to your local machine and navigating into the project directory.

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Dockerfile

Make sure that a `Dockerfile` exists in the project directory for building the microservice container.

### 3. Docker Compose

Ensure a `docker-compose.yml` file is present to orchestrate the services.

### 4. Build and Run Containers

To build and run the containers, execute the following command:

```bash
docker-compose up --build
```

## Getting Started

### 1. Create a Client

To use the quiz microservice, you'll need to create a client. Follow these steps:

- Run the CLI tool:

```bash
npm run cli
```

- Use the `create-client` command to generate a new client:

```bash
quiz-microservice-cli> create-client <name>
```

- Copy the generated `client_id` and `client_secret`. You’ll need them for generating an access token:

```json
{
  "clientId": "a0c69d88f8fadd76e135a4dc1dc4d6a0b894a4bc",
  "clientSecret": "64a2a222d19a6c7b804642feb8180573a02c4177"
}
```

### 2. Generate an Access Token using OAuth

To authenticate API requests, you need to generate an access token. Send a `POST` request to the `/oauth/token` endpoint with the following payload:

```bash
{
    "grant_type": "client_credentials",
    "client_id": "a0c69d88f8fadd76e135a4dc1dc4d6a0b894a4bc",
    "client_secret": "64a2a222d19a6c7b804642feb8180573a02c4177"
}
```

The response will return an access token that can be used as a Bearer token for subsequent requests:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImEwYzY5ZDg4ZjhmYWRkNzZlMTM1YTRkYzFkYzRkNmEwYjg5NGE0YmMiLCJpYXQiOjE3MjY3MjQ5NzcsImV4cCI6MTcyNjcyNDk4MH0.0q8U0Egt1QSYEsyiKgyntbzNl7tEXdRuLIohF5IkaYE",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Copy the `access_token` for use as the Bearer token in future API requests.
