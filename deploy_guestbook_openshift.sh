BASE_URL=.

function createProject {
  oc new-project guestbook
}

function deployFrontend {
  oc delete -f $BASE_URL/frontend-deployment.yaml
  oc apply -f $BASE_URL/frontend-deployment.yaml
}

function deployFrontendService {
  oc delete -f $BASE_URL/frontend-service.yaml
  oc apply -f $BASE_URL/frontend-service.yaml
}

function deployBackend {
  oc delete -f $BASE_URL/backend-deployment.yaml
  oc apply -f $BASE_URL/backend-deployment.yaml
}

function deployBackendService {
  oc delete -f $BASE_URL/backend-service.yaml
  oc apply -f $BASE_URL/backend-service.yaml
}

function exposeGuestbook {
  oc delete route frontend
  oc expose svc frontend
}

function exposeBackend {
  oc delete route backend
  oc expose svc backend
}

function obtainRoute {
  oc get route $1 -o jsonpath='{@.status.ingress[0].host}'
}

function defineClusterImagePolicy {
  oc apply -f cluster-image-policy.yaml
}

function defineRoleBinding {
  oc apply -f rolebinding.yaml
}

function addSCC {
  oc create sa privileged
  oc adm policy add-scc-to-user privileged -z privileged
  oc adm policy add-scc-to-user anyuid -z privileged
}

function defineGuestbookConfigMap {
  oc create configmap guestbook-config --from-literal=backend-url=backend-guestbook.patrocinio9-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud
}

function  deployMongoPVC {
  oc apply -f mongo1-pvc.yaml
  oc apply -f mongo2-pvc.yaml
}

function deployMongo {
  oc apply -f mongo1-deployment.yaml
}

function deployMongoService {
  oc apply -f mongo1-service.yaml
}

#createProject

defineClusterImagePolicy
#addSCC

oc project guestbook

#deployMongoPVC
#deployMongo
#deployMongoService

#deployBackend
#deployBackendService
#exposeBackend

#defineGuestbookConfigMap

#deployFrontend
#deployFrontendService
#exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE

#ROUTE=$(obtainRoute redis-master)
#echo Redis master route: $ROUTE
