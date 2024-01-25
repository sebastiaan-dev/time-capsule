# Https

## Assessment
- [x] Minimally, secure the application (enable https for the Web UI) using Ingress and a self-signed certificate
- [x] Ideally, install cert-manager
- [x] Configure a SelfSigned Issuer
- [x] Configure a CA Issuer
- [x] Configure Ingress with the certificate obtained from the CA Issuer 
- [x] Verify the connection with openssl  
- [x] Add all the resource files to the Project, as well as any commands you execute
- [x] Demo the TLS connectivity as part of the presentation.

## Information

In this section, we describe all commands executed.

### Install ingress
`helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace`

### Install cert-manager
We installed cert manager by running the following commands:

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.crds.yaml

# This failed in GCP Autopilot; see note below.
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.3 \
```

In GCP on an Autopilot, installing the helm chart failed at first with the error _"Error: INSTALLATION FAILED: failed post-install: timed out waiting for the condition"_. 
This is explained in the [Cert-Manager documentation](https://cert-manager.io/docs/installation/compatibility/#gke-autopilot); the problem modifications to the `kube-system` namespace are not allowed.
It can be solved by running the following alternative command:

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.3  --set startupapicheck.timeout=5m \
  --set installCRDs=true \
  --set global.leaderElection.namespace=cert-manager
```

### Configure a SelfSigned issuer

_cert-manager-ss-issuer.yaml_
```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned-issuer
  namespace: time-capsule
spec:
  selfSigned: {}
```

### Configure a CA Issuer
_cert-manager-ca-issuer.yaml_
```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: time-capsule-ca-issuer
  namespace: time-capsule
spec:
  ca:
    secretName: time-capsule-ca-secret
```

### Create certificate
_cert-manager-ca-cert.yaml_
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: time-capsule-ca
  namespace: time-capsule
spec:
  isCA: true
  commonName: time-capsule-ca
  subject:
    organizations:
      - Time Capsule.
    organizationalUnits:
      - Prod
  secretName: time-capsule-ca-secret
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: selfsigned-issuer
    kind: Issuer
    group: cert-manager.io
```
[Reference](https://cert-manager.io/docs/configuration/selfsigned/)

### Configure Ingress with the certificate obtained from the CA Issuer 
_cert-manager-ingress.yaml_
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-api
  namespace: time-capsule
  annotations:
    cert-manager.io/issuer: "time-capsule-ca-issuer"
spec:
  tls:
  - hosts: # this defines the SANs in the X509 certificate.
    - api.time-capsule.svc.cluster.local
    - api
    - api.time-capsule.xgloom.com 
    secretName: api-tls-secret
  rules:
  - host: api.time-capsule.xgloom.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 5000
  ingressClassName: nginx
```
We applied a similar Ingress configuration for the frontend.

### Verify the connection with openssl  
```bash
$ openssl verify -CAfile <(kubectl -n time-capsule get secret time-capsule-ca-secret -o jsonpath='{.data.ca\.crt}' | base64 -d) <(kubectl -n time-capsule get secret time-capsule-api-tls -o jsonpath='{.data.tls\.crt}' | base64 -d)`
/dev/fd/62: OK
```

## Demo
### Self Signed TLS Certificate applied to our API.
![TLS](https://github.com/sebastiaan-dev/time-capsule/assets/84989429/308e1680-a981-4806-b4f0-e1acc8125e8b)
This is untrusted because the browser does not trust this CA in its root store.

### Let's Encrypt TLS Certificate
<img width="1642" alt="Screenshot 2024-01-23 at 14 53 26" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/a93f2a47-fb6b-4193-8f50-0b92050ce6ab">

This certificate is trusted by Let's Encrypt, see history in CT logs: 
![image](https://github.com/sebastiaan-dev/time-capsule/assets/84989429/28f4885a-610c-425f-bd65-1b27e538a797)

