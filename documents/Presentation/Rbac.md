# RBAC

## Assessment
- [x] Configure ServiceAccounts/Users.
- [x] Create Roles with relevant permissions.
- [x] Create RoleBindings to associate the Users/ServiceAccounts with the Roles.
- [x] In the presentation, demonstrate what Users/ServiceAccounts can and cannot do.

## Information

In this section, we describe all commands executed. We have used `microk8s` to demonstrate RBAC. During the class on January 25, 2024, it was stated that the information covered is deemed adequate for obtaining all points.

### Configuration

At first, I ran into issues because there was no `known_tokens.csv` file generated after installing microk8s v1.29.0 (which is current latest/stable).
I resolved it by installing an older channel `sudo snap install microk8s --classic --channel=1.17/stable`.

We enabled RBAC first with: `microk8s enable rbac`. 

### Configure ServiceAccounts/Users

This configures a new user, serge, with a static API token:

```bash
export API_TOKEN=$(openssl rand -base64 48)
echo "$API_TOKEN,serge,sergeid" > /var/snap/microk8s/current/credentials/known_tokens.csv
microk8s stop && microk8s start # refresh config.
```

Let's test the token:

```bash
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")
curl -X GET $APISERVER/api --header "Authorization: Bearer $API_TOKEN" --insecure
```

This returns a successful API response:
```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "192.168.67.144:16443"
    }
  ]
}
```

### Create Roles with relevant permissions

At first, we started with a standard role from [Kubernetes.io](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

_reader-role.yaml_
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # Core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

### Create RoleBindings to associate the Users/ServiceAccounts with the Roles

_reader-binding.yaml_
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: serge
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role 
  name: pod-reader 
  apiGroup: rbac.authorization.k8s.io
```

### In the presentation, demonstrate what Users/ServiceAccounts can and cannot do

Now we can test the permissions of this standard role:

```bash
$ microk8s kubectl auth can-i create pod --namespace default --as serge
no
$ microk8s kubectl auth can-i list pod --namespace default --as serge
yes
```

---

## Practical demonstration

It works, now let's try to define a custom role, for an imaginary employee Cindy of our time-capsule application.

```bash
export API_TOKEN=$(openssl rand -base64 48)
echo "$API_TOKEN,cindy,cindyid" > /var/snap/microk8s/current/credentials/known_tokens.csv
microk8s stop && microk8s start
```

We now define the role and role binding:

_config-secret-manager-role.yaml_
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: time-capsule
  name: time-capsule-secret-manager
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["*"]
```

_config-secret-manager-binding.yaml_
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: time-capsule-manage-secrets
  namespace: time-capsule
subjects:
- kind: User
  name: cindy
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: time-capsule-secret-manager
  apiGroup: rbac.authorization.k8s.io
```

Let's now apply this RBAC configuration and briefly test if it works as expected:

`microk8s kubectl apply -f config-secret-manager-role.yaml -f config-secret-manager-binding.yaml`

```bash
$ microk8s kubectl auth can-i list secret --namespace time-capsule --as cindy
yes
$ microk8s kubectl auth can-i get secret --namespace time-capsule --as cindy
yes
$ microk8s kubectl auth can-i get secret --namespace time-capsule --as serge
no
```

Great, it works. Now Cindy can manage the config and secrets within our applications namespace, but she cannot create new deployments for example.

---

<img width="945" alt="image displaying that this RBAC config behaves as expected" src="https://github.com/sebastiaan-dev/time-capsule/assets/84989429/c8fbf1e3-a282-44b8-b5c6-0c0289ca5ba8">
