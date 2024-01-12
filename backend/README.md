# Time-Capsule Backend

## Installation
### Database
```bash
sudo docker run --name myPostgresDB -p 5455:YOUR_DB_PORT -e POSTGRES_PASSWORD=YOUR_DB_PASSWORD -d postgres
docker exec -it myPostgresDB bash

# exec in container
psql -U postgres

-- Create the "timecapsule_prod" database
CREATE DATABASE timecapsule_prod;

-- Connect to the "timecapsule-prod" database
\c timecapsule_prod;

-- Create the "timecapsules" table
CREATE TABLE timecapsules (
    id serial PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    date timestamp
);

\q

exit
```
### Configuration
edit the app/config.py file, entering the configuration about database
```python
DB_USERNAME: str = "postgres" # Default USERNAME is postgres
DB_PASSWD: str = "" # YOUR_DB_PASSWORD
DB_NAME: str = "timecapsule_prod"
DB_HOST: str = "" # IP Addredd
DB_PORT: int = 0 # YOUR_DB_PORT
TABLE_NAME: str = "timecapsules"
```
### Running
```bash
docker build -t capsule_backend_image .
docker run -d --name capsule_backend -p 80:80 capsule_backend_image
```

![main_page](.github/main_page.jpg)