BASE_URL=.

function createProject {
  oc new-project guestbook
}

function deployRedisMasterStorage {
  oc apply -f redis-master-pvc.yaml
}

function deployRedisMaster {
  oc delete -f $BASE_URL/redis-master-deployment.yaml
  oc apply -f $BASE_URL/redis-master-deployment.yaml
}

function deployRedisMasterService {
  oc apply -f $BASE_URL/redis-master-service.yaml
}

function deployRedisSlave {
  oc delete -f $BASE_URL/redis-slave-deployment.yaml
  oc apply -f $BASE_URL/redis-slave-deployment.yaml
}

function deployRedisSlaveStorage {
  oc apply -f redis-slave-pvc.yaml
}

function deployRedisSlaveService {
  oc apply -f $BASE_URL/redis-slave-service.yaml
}

function deployFrontend {
  oc delete -f $BASE_URL/frontend-deployment-openshift.yaml
  oc apply -f $BASE_URL/frontend-deployment-openshift.yaml
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

function exposeRedisMaster {
  oc delete route redis-master
  oc expose svc redis-master --port 6379
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

function deployMessaging {
  oc apply -f messaging-deployment.yaml
}

function deployMessagingService {
  oc apply -f messaging-service.yaml
}

function deployConsumer {
  oc apply -f consumer-deployment.yaml
}



function addSCC {
  oc create sa privileged
  oc adm policy add-scc-to-user privileged -z privileged
  oc adm policy add-scc-to-user anyuid -z privileged
}

createProject

defineClusterImagePolicy
addSCC

oc project guestbook

deployRedisMasterStorage
deployRedisMaster
deployRedisMasterService
exposeRedisMaster

deployRedisSlaveStorage
deployRedisSlave
deployRedisSlaveService

deployMessaging
deployMessagingService

deployConsumer


deployBackend
deployBackendService
exposeBackend

deployFrontend
deployFrontendService
exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE

#ROUTE=$(obtainRoute redis-master)
#echo Redis master route: $ROUTE
