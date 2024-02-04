# 🚧 Helm

## Assessment
- [x] Generating the Chart
- [x] Installing with the Chart
- [x] Uninstalling with the Chart
- [x] Upgrading an image with the Chart

## Information
### Generating the Chart
The Helm chart is in [`time-capsule/helm`](https://github.com/sebastiaan-dev/time-capsule/tree/main/helm)

```bash
helm create time-capsule
```

### Installing with the Chart
```bash
helm install time-capsule time-capsule/
```

### Uninstalling with the Chart
```bash
helm uninstall time-capsule
```

### Upgrading an image with the Chart
To update, you can modify the value in values.yaml. Use `-f` to override the value or use `set` to specifically override a certain value.

```yaml
API_IMAGE_SOURCE: europe-west4-docker.pkg.dev/time-capsule-412314/time-capsule/api:1.0
FRONTEND_IMAGE_SOURCE: europe-west4-docker.pkg.dev/time-capsule-412314/time-capsule/frontend:1.0
DB_IMAGE_SOURCE: postgres:16
```
This represents a foundational configuration within our Helm chart. Future enhancements may involve the implementation of template values for various ports et cetera.
