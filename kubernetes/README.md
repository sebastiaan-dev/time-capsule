# Kubernetes Deployment

This readme covers how to manually configure a kubernetes cluster and deploy the time capsule application.

## Config

The time capsule application requires the below kubernetes add-ons.

### Steps

Install nginx ingress

```sh
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

Install cert-manager

```sh
helm repo add jetstack https://charts.jetstack.io
helm repo update

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.crds.yaml

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.3  --set startupapicheck.timeout=5m \
  --set installCRDs=true \
  --set global.leaderElection.namespace=cert-manager
```

Install metrics (optional)

```sh
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/

helm install my-metrics-server metrics-server/metrics-server --version 3.11.0
```

## Build

Since the kubernetes deployment files reference docker images hosted in a registry these images should be built and pushed to the corresponding registry. The instruction cover segerritsen as root, if you use your own registry you will have to change the reference in the deployment files as well.

### Steps

Execute this command in the corresponding folder of the service to be build:

```sh
docker build -t segerritsen/time-capsule-<app>:1.0 --platform=linux/amd64 .
```

Then push it to docker hub, do make sure there is a repository for the service available.

```sh
docker push segerritsen/time-capsule-<app>:1.0
```

## Deploy

The following steps describe how to deploy the application.

### Steps

First deploy the namespace in which our application stack will live:

```sh
kubectl apply -f namespace.yaml
```

Apply networking configuration before service deployment to prevent crashes:

```sh
kubectl apply -f networking
```

Deploy each service by applying the respective folder, a folder contains a deployment and service. Optionally it has a policy, ingress, config and secrets.

```sh
kubectl -n time-capsule apply -f <service>
```

## Other

### Secrets

Secrets inside Secret kubernetes objects require to be formatted in base64.

```sh
echo -n '<value>' | base64
```
