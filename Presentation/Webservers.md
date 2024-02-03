# Webservers

## Assessment

- [x] **API:**
  - [x] **1.1 Create REST API:**
    - Using a technology of your choosing, create a REST API that minimally contains a GET and a POST endpoint. This API should be served by some programming framework or actual application server that can run standalone on the Linux operating system. Popular frameworks are Java JAX-RS (with application servers like Liberty) or Python Flask/FastAPI.
  - [x] **1.2 Containerize the Application:**
    - Containerize the application by creating a Dockerfile and building an image with Docker build.
  - [x] **1.3 Create Kubernetes Deployment:**
    - Create a Kubernetes Deployment that can run one or more replicas of the application. Practice with scaling up and down the number of replicas.
  - [x] **1.4 Create Kubernetes Service/Ingress:**
    - Create a Kubernetes Service/Ingress that exposes the API. Consider the consumption pattern and decide whether you need just a Cluster IP, NodePort, Load Balancer, or Ingress.
  - [x] **1.5 Test API Access:**
    - Test that you can access the API with `curl`, both from inside the cluster and, if needed, from outside the cluster.

- [ ] **Web UI:**
  - [ ] **2.1 Create Web UI:**
    - Using a technology of your choosing, create a Web UI that consumes the API. Common choices include Angular and React. The Web UI should be served by an application server such as nginx or Apache HTTP Server.
  - [ ] **2.2 Containerize Web UI Application:**
    - Containerize the Web UI application + application server by choosing a suitable base image and creating a Dockerfile that installs the application distribution on the application server. For example, if you use Angular+nginx, create a multi-stage Dockerfile (with 2 FROM lines).
  - [ ] **2.3 Create Kubernetes Deployment:**
    - Create a Kubernetes Deployment that initializes one or more replicas of the Web UI.
  - [ ] **2.4 Create Kubernetes Service/Ingress:**
    - Create a Kubernetes Service/Ingress that can be accessed by end users outside of the cluster. Consider the consumption pattern and decide whether you need just a Cluster IP, NodePort, Load Balancer, or Ingress.
  - [ ] **2.5 Test Web UI Access:**
    - Test that you can access the Web UI using a web browser on a machine outside of the cluster.

## Information

In this section, we describe the decisions we have made and why. Note that the [Diagrams](Diagram.md) section contains additional (visual) information on the workings of the frontend, API and DB.

### 🚧 API
#### 1.1 Create REST API
We use FastAPI to build our REST API, which consists of two API endpoints. The first one is GET `/timecapsule`, which returns all information about the capsule we have created in the following format:
``` python
{
  "code": success.code,
  "message": success.message,
  "data": {
    "opened_capsules": opened_capsules, # includes titles and messages of opened capsules
    "opened_count": total_opened_count, # number of opened capsules
    "closed_capsule": closed_capsule, # closed capsules without titles and messages
    "closed_count": total_closed_count, # number of closed capsules
    "next_flag": flag_next # flag for frontend to determine if there is another page to render
  }
}
```

The second one is POST `/timecapsule`, which generates a new capsule using user parameters such as title, message, and open date. The API server validates each parameter's validity. For title and message fields, they can be either too short or too long. As for the date field, it cannot be earlier than the current time.

We implement `error_code` and `error_message` in our HTTP responses to convey clear feedback from the API to the frontend.
```python
success = Response(1000, "Success")

param_error = Response(2000, "parameter error")
param_title_error = Response(2001, f"the length of title is less than {settings.MIN_TITLE_LEN}")
param_message_error = Response(2002, f"the length of message is less than {settings.MIN_TITLE_LEN}")
param_expire_error = Response(2003, f"the open date is longer than {settings.MAX_EXPIRE_DAY}")
param_date_invalid = Response(2004, f"the open date is smaller than the current date")
server_error = Response(4000, f"server internal error")
```

#### 1.2 Containerize the Application

In our dockefile, it builds a Docker container for a Python 3.9 web application, copies the application code and dependencies, installs them using pip, and runs the app using Uvicorn on port 5000.

We created and uploaded the image on Docker Hub. You can find it at [this link](https://hub.docker.com/r/segerritsen/time-capsule-api).

```dockerfile
FROM python:3.9
WORKDIR /api

COPY ./requirements.txt /api/requirements.txt
COPY ./app /api/app
COPY main.py /api/main.py

RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
```

### 1.3 Create Kubernetes Deployment
Creating API-related pods in Kubernetes using `apply`:

![API Creation](includes/api-create.png)

The default number of replicas is set to 2:

![Deployment](includes/api-deploy.png)

To scale the replicas up or down, use the `scale` command:

![Scaling](includes/api-scale.png)

### 1.4 Create Kubernetes Service/Ingress
We used a ClusterIP (default) service:

```yaml
<snippet>
spec:
  selector:
    app: api
  ports:
   - port: 5000
     targetPort: 5000
</snippet>
```

Furthermore, we leverage nginx-ingress to direct requests matching the specified HTTP Host to our API ClusterIP service:

```yaml
      <snippet>
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 5000
      </snippet>
```

### 1.5 Test API Access
The default setting is ClusterIP which allows us to  `curl` the API within the cluster:

![test-inside](includes/api-test-inside.png)

To test API access from the outside, we could for example change the type to `NodePort` and add a `nodePort`:
```yaml
  type: NodePort
  ports:
   - port: 5000
     nodePort: 30002
     targetPort: 5000
```

After exposing our service via an Ingress load balancer, we confirm that the API is also accessible from the internet:

![curl-internet](includes/curl-internet.png)


### 🚧 Web UI
#### 1.1 Create Web UI

#### 1.2 Containerize the Application

In our multi-stage Dockerfile, including node and nginx, it builds a Docker container for Web UI, copies the application code and dependencies.

We created and uploaded the image on Docker Hub. You can find it at [this link](https://hub.docker.com/r/segerritsen/time-capsule-frontend).

```dockerfile
# Seperate image for building the application
FROM node:20.9-slim as build

WORKDIR /app
# Enable corepack for version manager
RUN corepack enable
# Copy required files
COPY .yarn /.yarn
COPY .yarnrc.yml package.json yarn.lock ./
# Install dependencies
RUN yarn
# Copy source files
COPY . .
# Build
RUN yarn build
# Allow container to set environment variables
RUN yarn add @import-meta-env/cli
RUN npx pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
  -t node18-alpine-x64 \
  -o import-meta-env-alpine

# Use an nginx image to serve the application
FROM nginx:1.25.2-alpine

COPY .env.example start.sh /usr/share/nginx/html/
COPY --from=build /app/import-meta-env-alpine /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html/

CMD ["sh", "start.sh"]
```

### 1.3 Create Kubernetes Deployment
Creating Frontend-related pods in Kubernetes using `apply`:

![Frontend Creation](includes/frontend-create.png)

The default number of replicas is set to 2:


![Deployment](includes/frontend-deploy.png)

To scale the replicas up or down, use the `scale` command:

![Scaling](includes/frontend-scale.png)

### 1.4 Create Kubernetes Service/Ingress
We used a ClusterIP (default) service:

```yaml
<snippet>
spec:
  selector:
    app: frontend
  ports:
   - port: 80
     targetPort: 80
</snippet>
```

### 1.5 Test Web UI Access
The default setting is ClusterIP which allows us to  `curl` the Frontend within the cluster:

![test-inside](includes/frontend-test-inside.png)

To test Frontend access from the outside, we could for example change the type to `NodePort` and add a `nodePort`:
```yaml
  type: NodePort
  ports:
   - port: 80
     nodePort: 80
     targetPort: 80
```

After exposing our service via an Ingress load balancer, we confirm that the Web frontend is also accessible from the internet:

![curl-internet](includes/browser-internet.png)

