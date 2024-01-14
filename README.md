# Time Capsule

## Todo
- [ ] frontend
- [ ] api
- [x] database
- [ ] uml diagram
- [x] dockerfile db
- [x] dockerfile api
- [ ] dockerfile frontend
  
- [ ] kubernetes yaml schemas
- [ ] microk8s deployment
- [ ] certificate management
- [ ] TLS

- [ ] RBAC: https://microk8s.io/docs/multi-user

## Frontend
- Create a time capsule
	- Title
	- Message -> text
	- DateTime to open the capsule -> DateTime
## API
Hostname: `api.timecapsule.io`
### Create
POST `/timecapsule`
- limit title, message length
- 100 years limit
#### Request
```json
{
	title: string,
	message: string,
	date: DateTime
}
```
#### Response
```json
{
	code: ErrorCode
}
```
### Capsules
GET `/timecapsule`
#### Request
`/timecapsule?start=number&limit=number`
- Limit needs constraint
#### Response
```json
{
  "opened_capsules": [
    {
      "title": "string",
      "message": "string",
      "date": "DateTime"
    },
    {},
    {}
  ],
  "closed_capsule": {
    "next_time": "DateTime",
    "total_count": "number"
  }
}
```
or
```json
{
	code: ErrorCode
}
```
### Database
Start is offset, limit is amount of items per query result. Sort by newest expired/opened capsule to oldest.

#### Decision
- NoSQL can scale horizontally, SQL vertically. Ideally, we scale horizontally as much as possible for our entire arch. However, this is not requirement for the persistent DB layer in the project.
- Relational DB Management System (RDBMS) makes sense because we want to keep the option open to allow timecapsules to relate to specific users in the future.
- MySQL is Oracle owned, PostgreSQL has a strong ecosystem and is open source; complying to Cloud Native Definition: "The Cloud Native Computing Foundation seeks to drive adoption of this paradigm by fostering and sustaining an ecosystem of open source, vendor-neutral projects.".
- Postgres allows more complex data types, which may be nice. Also concurrency is achieved by multiversion concurrency control (MVCC) instead of write-locks, which helps if this application would scale to multiple users that are creating concurrent connections.
- Choice: PostgreSQL.

```sql
-- Create the "timecapsule_prod" database
CREATE DATABASE timecapsule_prod;

-- Connect to the "timecapsule-prod" database
\c timecapsule_prod;

-- Create the "timecapsules" table
CREATE TABLE timecapsules (
    id serial PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    date timestamp
);
```

https://stackoverflow.com/a/40031181
