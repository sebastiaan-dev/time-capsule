# Database

## Build and run

```bash
docker build -t postgres-db-image .
docker run -d --name postgres-db-container --network time-capsule-network postgres-db-image
```

This adds the database to a docker `time-capsule-network`, which we have defined earlier. 
The REST API is configured to connect with the `postgres-db-container` by hostname, which ensures that it's automatically found on the network. 
This ensures that there's no need to manually set specific IPs. 

## Database info
```
POSTGRES_DB=timecapsule_prod
POSTGRES_USER=postgres
POSTGRES_PASSWORD=s3cr3tp4ssw0rd

POSTGRES_PORT=5432
```
