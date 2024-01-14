FROM postgres:16

# Set the environment variables
ENV POSTGRES_DB=timecapsule_prod
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=s3cr3tp4ssw0rd

# Copy the initialization script into the container
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
