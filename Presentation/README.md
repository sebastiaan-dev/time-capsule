## Presentation

### Sequence Diagram: User-agent GETs Timecapsules
```mermaid
sequenceDiagram
    participant User-agent
    participant Front-end
    participant REST API
    participant Postgres DB

    User-agent->>Front-end: HTTP GET Request: /
    Front-end-->>User-agent: HTTP Response (UI)

    User-agent->>REST API: HTTP GET Request: /timecapsule?start=1&limit=10

    REST API->>Postgres DB: SQL SELECT Query
    Postgres DB-->>REST API: SQL Results
    
    REST API-->>User-agent: HTTP Response (API)
```

### Sequence Diagram: User-agent POSTs Timecapsule
```mermaid
sequenceDiagram
    participant User-agent
    participant Front-end
    participant REST API
    participant Postgres DB

    User-agent->>Front-end: HTTP GET Request: /
    Front-end-->>User-agent: HTTP Response (UI)

    User-agent->>REST API: HTTP POST Request: /timecapsule

    REST API->>Postgres DB: SQL INSERT Command
    Postgres DB-->>REST API: SQL Results
    
    REST API-->>User-agent: HTTP Response (API)
```

### UML Class Diagram
![Time-capsule - UML API diagram](./Time-capsule%20-%20UML%20API%20diagram.png)


- Edit the [Lucidchart here](https://lucid.app/lucidchart/2603a3fc-15f5-4298-adff-3e06fd22bff7/edit?viewport_loc=-846%2C-217%2C3555%2C1837%2C0_0&invitationId=inv_a698e5e1-5cb3-4e22-9ab1-65e1367876ef).
