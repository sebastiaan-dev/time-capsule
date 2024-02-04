# Network Policy

## Assessment

- [x] 2 points for each correct and useful network policy, with a maximum of 3 policies.

## Information

In this section we describe the network policy setup. As the application lives in its own namespace `time-capsule` we only define policies for network traffic in this namespace.

### Application wide policies

We first define 2 policies which apply to all pods in the namespace. The first is a deny-all, this policy blocks all Ingress and Egress from and to all pods in the namespace. We use this strategy so that all network traffics flows are explicitly configured in code for maximum security and traceability. The second policy allows DNS traffic to the `kube-system` namespace, this is required for resolving hostnames of internal cluster services. For the DNS policy to work correctly it is assumed that `kube-dns` is active.

_The deny all policy:_

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: time-capsule
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

_The DNS policy:_

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: dns-policy
  namespace: time-capsule
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: kube-system
        podSelector:
          matchLabels:
            k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```

### API

The api has 2 policies:

- **nginx policy**, this policy allows communication to the `ingress-nginx` namespace which contains the loadbalancer. It is used to facilitate comminication to and from devices outside the cluster.

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-nginx-policy
  namespace: time-capsule
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 5000
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 5000
```

- **db-policy**, this policy allows communication to and from the internal `db` service.

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-db-policy
  namespace: time-capsule
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: db
      ports:
        - protocol: TCP
          port: 5432
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: db
      ports:
        - protocol: TCP
          port: 5432
```

### Frontend

- **nginx policy**, this policy allows communication to the `ingress-nginx` namespace which contains the loadbalancer. It is used to facilitate comminication to and from devices outside the cluster.

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-nginx-policy
  namespace: time-capsule
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 80
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: 80
```

### DB

- **api-policy**, this policy allows communication to and from the `api` service.

```yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-api-policy
  namespace: time-capsule
spec:
  podSelector:
    matchLabels:
      app: db
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api
      ports:
        - protocol: TCP
          port: 5432
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: api
      ports:
        - protocol: TCP
          port: 5432
```
