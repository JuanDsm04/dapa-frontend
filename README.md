# DAPA Frontend

This repository contains a frontend web application developed using **VueJS**, as well as its setup and execution using **Docker**.

## Getting started

1. Clone the repository 

```sh
git clone https://github.com/JuanDsm04/dapa-frontend
cd dapa-frontend
```

2. Install dependencies

```sh
npm install
```

## Project Setup

1. Make sure to configure your ```.env``` file containing the base URL for the API.
```sh
BASE_URL=https://your-api-url.com
```

### Build and serve through Docker

```sh
docker compose up --build
```

### Stop Docker Compose

```sh
docker compose down
```
