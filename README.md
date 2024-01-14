# Time capsule

---

## Configuration
- Create a Docker network so that the API can resolve the DB automatically:
  - `docker network create --subnet=172.18.0.0/16 time-capsule-network`.
- Follow steps in README of `/api` and `/db` to configure these hosts.
