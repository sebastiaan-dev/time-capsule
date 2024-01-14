# Database

## Build and run
```bash
docker build -t postgres-db-image .
docker run -d --name postgres-db-container -p 5432:5432 postgres-db-image
``` 

## Database info
```
POSTGRES_DB=timecapsule_prod
POSTGRES_USER=postgres
POSTGRES_PASSWORD=s3cr3tp4ssw0rd

POSTGRES_PORT=5432
```
