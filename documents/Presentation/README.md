# Presentation materials

- Diagram assessment
    - Asked on 15/01/2024 during class if these diagrams are what is expected or if changes are desired.
    - Professor said that this is good, however, when we are doing the kubernetes deployment that would also need to be included; this includes load balancer/ingress, cluster IP, pod targetports, etc.

## Diagrams

#### Kubernetes Cluster diagram
```mermaid
graph LR;
 client([client])-. Ingress .->ingress[Ingress];
 ingress-->|HTTP Request|routingRule{Rules};
 subgraph Cluster
  routingRule;
  ingress;
  routingRule-->|route|service1[Frontend Service: ClusterIP];
  routingRule-->|route|service2[API Service: ClusterIP];
   subgraph Frontend Deployment
     style service1 fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
     service1-->pod1[Pod];
     service1-->pod2[Pod];
    end
    subgraph API Deployment
     service2-->pod3[Pod];
     service2-->pod4[Pod];
    end
    pod3-->dbService[DB Service: ClusterIP];
    pod4-->dbService[DB Service: ClusterIP];
    subgraph DB Deployment
      pod5;
      dbService;
      dbService-->pod5[Pod];
    end
 end
 
classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class ingress,routingRule,service1,service2,pod1,pod2,pod3,pod4,pod5,dbService,dbPod, k8s;
class client plain;
class cluster cluster;
```

#### Sequence Diagram: User-agent GETs Timecapsules
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

#### Sequence Diagram: User-agent POSTs Timecapsule
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

#### UML Class Diagram
![Time-capsule - UML API diagram](./Time-capsule%20-%20UML%20API%20diagram.png)
- Edit the [Lucidchart here](https://lucid.app/lucidchart/2603a3fc-15f5-4298-adff-3e06fd22bff7/edit?viewport_loc=-846%2C-217%2C3555%2C1837%2C0_0&invitationId=inv_a698e5e1-5cb3-4e22-9ab1-65e1367876ef).
