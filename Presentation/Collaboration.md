# Collaboration

## Presentation plan
- Everyone records videos with face to present the required info.
- Upload to [GDrive](https://drive.google.com/drive/folders/1c_XRjPrOGvKvASfrjpt__HsWxuh0N1CH?usp=sharing)
- We need to finish NetworkPolicies and Helm still before we're able to present everything (especially policy and helm part).

## Who does what?
**Serge:**
- [ ] Introduce application.
- [ ] Architecture and Artifacts (Max 3 minutes)
	- [ ] Describe the architecture of the application using one or more types of UML diagrams (class diagram, component diagram, sequence/collaboration diagram, deployment diagram) - Max 2 points.  
	- [ ] Show and describe the artifacts you created to build the docker images - Max 1 point.
	- [ ] Show and describe the artifacts created to deploy the application to Kubernetes - Max 2 points.

**Sebastiaan:**
- [ ] Pre-requisites (Max 4 Minutes)
	- Show how you configured the pre-requisites for the application
	- [ ] Load Balancer - 1 point
	- [ ] Storage Class - 1 point
	- [ ] image Registry - 1 point
	- [ ] certificates - 1 point
	- [ ] network policies - 1 point
		- Need to show with timeouts on blocked requests and succesful curl/wgets on allowed requests (info from Max).
  - [ ] * **Serge:** roles - 1 point
  	- Need to show with can-i. 

**Hanjun:**
- [ ] Container build and first deployment, scaling, uninstallation (Max 4 minutes).
	- Second demo cluster? Resources / billing; sebastiaan checks if possible 2 make second cluster.
	- [ ] Show how you build the container images and publish to a registry (1 point).
	- [ ] Show how you deploy the application for the first time (1 point).
		- Should be done with Helm, which we need to get ready after Sebastiaan finishes NetworkPolicies.
	- [ ] **Show how to scale the application horizontally (stateless parts only) (1 point)**.
		- Change --replicas=3, could be done with Helm values; see above.
	- [ ] Show how to uninstall the application (1 point).

- [ ] Application upgrade and re-deployment (max 4 minutes)
	- [ ] Show how you re-build the application after a source code change (1 point).: **Sebastiaan**.
	- [ ] Show how you upgrade the running application in two ways: deployment rollout (2 points): **Hanjun**, use `:latest` image in deployment.yaml.
	- [ ] and canary update (2 points): **Hanjun**, use `:latest` image in deployment.yaml.

## When do we sync?
- Add all files before Wendesday 17.00, then we sync via Google Meet and check to make everything submission-ready.
