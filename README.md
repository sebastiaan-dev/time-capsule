# Time Capsule

## Todo
- [ ] frontend
- [ ] api
- [ ] database
- [ ] uml diagram
- [ ] dockerfiles
  
- [ ] kubernetes yaml schemas
- [ ] microk8s deployment
- [ ] certificate management
- [ ] TLS

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
