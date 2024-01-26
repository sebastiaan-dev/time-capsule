# Webservers

## Assessment

- [ ] **API:**
  - [ ] **1.1 Create REST API:**
    - Using a technology of your choosing, create a REST API that minimally contains a GET and a POST endpoint. This API should be served by some programming framework or actual application server that can run standalone on the Linux operating system. Popular frameworks are Java JAX-RS (with application servers like Liberty) or Python Flask/FastAPI.
  - [ ] **1.2 Containerize the Application:**
    - Containerize the application by creating a Dockerfile and building an image with Docker build.
  - [ ] **1.3 Create Kubernetes Deployment:**
    - Create a Kubernetes Deployment that can run one or more replicas of the application. Practice with scaling up and down the number of replicas.
  - [ ] **1.4 Create Kubernetes Service/Ingress:**
    - Create a Kubernetes Service/Ingress that exposes the API. Consider the consumption pattern and decide whether you need just a Cluster IP, NodePort, Load Balancer, or Ingress.
  - [ ] **1.5 Test API Access:**
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

In this section, we describe the decisions we have made and why. 

### 🚧 API
TODO

### 🚧 Web UI
TODO
