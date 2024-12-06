# @ovhcloud/bpmn-tool-backend

> Backend for the [@ovhcloud/bpmn-tool UI](https://github.com/ovh/bpmn-tool).

## Installation

```bash
# Install
$ yarn install

# Copy the .env file
$ cp .env.example .env
```

Then, you also need to start a `Postgres` database and init the schema:

```bash
# Run the database:
$ docker run --rm -it --name bpmn-tool-database -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

# Apply the migration:
$ docker exec -i bpmn-tool-database psql -U postgres -d postgres < ./migrations/init.sql
```

## Usage

```bash
yarn start
```

The backend will start on port 3000.
