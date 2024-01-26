# Diagrams

## Diagrams

### Kubernetes

#### Kubernetes Cluster diagram
```mermaid
graph LR;
 client([client])-. Ingress .->ingress[Ingress];
 ingress-->|HTTP Request|routingRule{Rules};
 subgraph Cluster
  routingRule;
  ingress;
  routingRule-->|route|service1[ClusterIP: Frontend Service];
  routingRule-->|route|service2[ClusterIP: API Service];
  pod3-->dbService[ClusterIP: DB Service];
  pod4-->dbService[ClusterIP: DB Service];
  subgraph Control Plane
      apiServer[API Server];
      etcd;
      scheduler[Scheduler];
      cm[Controller Manager];
      ccm[Cloud Controller Manager];
      configmap1;
      secret1;
      apiServer --> etcd;
      apiServer --> scheduler;
      apiServer --> cm;
      apiServer --> ccm;
      etcd -..-> configmap1[ConfigMap: db];
      etcd -..-> configmap2[ConfigMap: frontend];
      etcd -..-> secret1[Secret: db];
    end
   subgraph Frontend Deployment
     style service1 fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
     service1-->pod1[Pod];
     service1-->pod2[Pod];
     k1[kubelet]-->|ConfigMap: frontend|apiServer;
    end
    subgraph API Deployment
     service2-->pod3[Pod];
     service2-->pod4[Pod];
     k2[kubelet]-->|Secret and ConfigMap: db|apiServer;
    end
    subgraph DB Deployment
      k3[kubelet]-->|Secret and ConfigMap: db|apiServer;
      pod5;
      dbService;
      dbService-->pod5[Pod];
    end
 end
 
classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef config fill:#fff,stroke:#000,stroke-width:1px,color:#000
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class ingress,apiServer,etcd,scheduler,cm,ccm,routingRule,k1,k2,k3,service1,service2,pod1,pod2,pod3,pod4,pod5,dbService,dbPod k8s;
class secret1,secret2,configmap1,configmap2 plain;
class client plain;
class cluster cluster;
```

Note that we TLS is terminated at ingress, by doing so we achieve SSL/TLS offloading to alleviate workload on the cluster internal nodes.

In the future, depending on the security requirements, we could explore adding a WAF to filter on the decrypted traffic and potentially perform TLS re-encryption for the traffic between the load balancer and the backend pods; potentially mTLS. This is computationally more desirable because we could maintain a more persistent connection on the backend side.

### Sequence Diagrams
#### User-agent GETs Timecapsules
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

#### User-agent POSTs Timecapsule
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

---

## Assessment 
On 15/01/2024, I asked for feedback on the diagrams. The professor mentioned they were good. However, they suggested including Kubernetes deployment details like load balancer/ingress, cluster IP, pod target ports.
On 23/01/2024, I confirmed if the Kubernetes deployment was now complete, and the professor affirmed that it was.
