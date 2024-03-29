# Updates

## Assessment
- [x] Show how you re-build the application after a source code change.
- [x] Prepare at least two different versions of one image
- [x] Show deployment rollout
- [x] Show canary update
- [x] Write down the steps
- [ ] Record a video of how this gets executed
- [x] Demo how the Web UI changes after the upgrade

## Information on build and versioning

In this section, we describe all commands executed.

### Rebuild and prepare at least two different versions of one image
```bash
export LOCATION="europe-west4"                                                                                                                             
export PROJECT_ID="time-capsule-412314"
export REPOSITORY="time-capsule"
export VERSION="2"

docker build -t $REPOSITORY/frontend:$VERSION frontend-v2/
docker tag $REPOSITORY/frontend:$VERSION $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/frontend:$VERSION
docker push $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/frontend:$VERSION
```

The image is now pushed to the GCP Artifact Registry.

## Show canary update

Important changes are names (canary as prefix/suffix) and the container image in the spec (`frontend:2`).

_canary-deployment.yaml_
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: canary-frontend
  namespace: time-capsule
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend-canary
  template:
    metadata:
      labels:
        app: frontend-canary
        policy: frontend-canary
    spec:
      containers:
      - name: frontend-canary
        image: europe-west4-docker.pkg.dev/time-capsule-412314/time-capsule/frontend:2
        imagePullPolicy: Always
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        env:
        - name: API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-base-url
        ports:
        - containerPort: 80
```

We add a service, named `canary-frontend`.

_canary-service.yaml_
```yaml
apiVersion: v1
kind: Service
metadata:
  name: canary-frontend
  namespace: time-capsule
spec:
  selector:
    app: frontend-canary
  ports:
   - port: 80
     targetPort: 80
```

This is a copy of the normal ingress configuration, however, now we add annotations to ensure that 50% of the traffic goes to the `canary-frontend`-service.

_canary-cert-manager-ingress-frontend.yaml_
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: canary-ingress-frontend
  namespace: time-capsule
  annotations:
    cert-manager.io/issuer: "time-capsule-ca-issuer"
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "50"
spec:
  tls:
  - hosts:
    - time-capsule.sebastiaan.tech
    secretName: frontend-tls-secret
  rules:
  - host: time-capsule.sebastiaan.tech
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: canary-frontend
            port:
              number: 80
  ingressClassName: nginx
```

The three YAMLs were added to a folder `canary` and we can apply it with: `kubectl apply -f canary/`.

### Demo how web UI changes
Here you can see how the UI changes (including HTML title) for 50% of the time when ingress sends the client to the canary-frontend service.

![canary](https://github.com/sebastiaan-dev/time-capsule/assets/84989429/ae93f4f6-3885-4aac-981f-04ae575b930c)

<img width="870" alt="image old UI" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/44b4b85b-59b7-4135-aef9-375297b29e63">
<img width="868" alt="Image new UI" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/d1837727-d9d3-4c92-b51e-afe28a8ae881">

---

### Show rolling update

First deployment was as following:

_deployment.yaml_

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: time-capsule
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        policy: frontend
    spec:
      containers:
      - name: frontend
        image: europe-west4-docker.pkg.dev/time-capsule-412314/time-capsule/frontend:1.0 
        imagePullPolicy: Always
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        env:
        - name: API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-base-url
        ports:
        - containerPort: 80
```

Then, we updated this to the following, note that the image in spec.template changed and the strategy was defined:

_deployment.yaml_

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: time-capsule
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        policy: frontend
    spec:
      containers:
      - name: frontend
        image: europe-west4-docker.pkg.dev/time-capsule-412314/time-capsule/frontend:2
        imagePullPolicy: Always
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        env:
        - name: API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-base-url
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

I had applied this new deployment: `kubectl apply -f nginx-deployment.yaml --record`, but if the nginx-deployment was already applied, a change to `spec.template` change **should** trigger a rolling update automatically.
One could also not edit the yaml and run a command such as `kubectl --record --namespace=time-capsule deployment.apps/... set image deployment.v1.apps/... <image:tag>`

```bash
$ kubectl --namespace=time-capsule rollout status deployment/frontend`
deployment "frontend" successfully rolled out
```

The changes are made:
<img width="868" alt="Image new UI" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/d1837727-d9d3-4c92-b51e-afe28a8ae881">

We can even rollback easily:

```bash
$ kubectl --namespace=time-capsule rollout history deployment/frontend
REVISION  CHANGE-CAUSE
1         <none>
2         kubectl apply --filename=deployment.yaml --record=true

$ kubectl --namespace=time-capsule rollout undo deployment/frontend --to-revision=1
```

The changes are undone:
<img width="870" alt="image old UI" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/44b4b85b-59b7-4135-aef9-375297b29e63">
