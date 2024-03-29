# Database

## Assessment
- [x] Choose the database that you want to work with.
- [x] It is recommended that you use an official image for that database instead of building your own.
- [x] Create the Kubernetes resources required to configure and run the database:
  - [x] Kubernetes StatefulSet or Kubernetes Deployment to run the database image
  - [x] Kubernetes ConfigMap to contain any database parameters that are not secret, like database name, user name, port
  - [x] Kubernetes Secret to contain the database password
  - [x] Kubernetes Service to expose the database port so that it can be used by the REST API. What type of Service should you use (ClusterIP, NodePort, Load Balancer, Ingress)?
  - [x] Kubernetes StorageClass, PersistentVolume and PersistentVolumeClaim that the database image can use to store the database data
- [x] Think about how to initialize the database with the required schema (if applicable) and data
- [x] Adapt your REST API so that it accesses the database through its service
- [x] Test the REST API with curl and verify that it can both read from and write to the database.

## Information

In this section, we describe the decisions we have made and why. 

### Choosing the database
We choose for a Relational DB Management System (RDBMS). We would like to allow our application to associate timecapsules to specific users in the future. 
An SQL database does provide a clear structure to accomplish this. 
MySQL is Oracle owned and PostgreSQL has a strong ecosystem, supports more datatypes out of the box and is open source.
_"The Cloud Native Computing Foundation seeks to drive adoption of this paradigm by fostering and sustaining an ecosystem of open source, vendor-neutral projects."_ [CNCF Cloud Native Definition v1.0 ](https://github.com/cncf/foundation/blob/2f97c6e339e67a929651a54370c4cd36385822c3/charter.md).

### Official Image 

At first we used the Bitnami Charts for Postgres, but we concluded by using the official postgres:16 container image.

### Create Kubernetes resources
We created a StatefulSet and used the official container image. We then added the relevant Secret and configMap kv pairs in the env variables (further elaborated upon below).

_statefulset.yaml_
```yaml
        <snippet>
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: db-username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: db-password
        </snippet>
```

We created a PVC:

_pvc.yaml_
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: time-capsule
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

Then we used this PVC claim, mount it to `/var/lib/postgresql/data` and pass the env variable PGDATA to communicate that the data should be stored on the mounted path. 

_statefulset.yaml_
```yaml
        <snippet>
        env:
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        ports:
        volumeMounts:
          - name: postgres-db
            mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-db
        persistentVolumeClaim:
          claimName: postgres-pvc
        </snippet>
```

Please note the use of PVC instead of a `volumeClaimTemplate` here. This choice is driven by the current implementation, where a single replica is created, and it's appropriate for the associated pod to utilize a dedicated PVC. As of now, scaling the stateful database is not implemented. If scalability is desired in the future, the use of a `volumeClaimTemplate` would likely be considered.

Finally, we used a ClusterIP service to reach our database pods via this (cluster) IP address.

### Initialize the Database
The database tables (part of schema) are automatically created by FastAPI in _main.py_: `models.Base.metadata.create_all(bind=engine)`.

### Adapt the REST API so that it accesses the database through its service
The API uses environment variables in _app/config.py_. In the _deployment.yaml_ these environment variables are initialized by using configMaps and Secrets:
```yaml
        <snippet>
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: db-config
              key: db-name
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: db-username
        </snippet>
```

### Test the REST API with curl and verify that it can both read from and write to the database.
It works with curl and within the browser. We demo GETs and POSTs to retrieve and store data respectively.
