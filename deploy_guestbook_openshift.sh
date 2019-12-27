BASE_URL=https://raw.githubusercontent.com/patrocinio/guestbook/redis_lock/

function createProject {
  oc new-project guestbook
}

function deployRedisMaster {
  oc apply -f $BASE_URL/redis-master-deployment.yaml
}

function deployRedisMasterService {
  oc apply -f $BASE_URL/redis-master-service.yaml
}

function deployRedisSlave {
  oc apply -f $BASE_URL/redis-slave-deployment.yaml
}

function deployRedisSlaveService {
  oc apply -f $BASE_URL/redis-slave-service.yaml
}

function deployFrontend {
  oc apply -f $BASE_URL/frontend-deployment.yaml
}

# Deprecated
function deployFrontendService {
  oc apply -f $BASE_URL/frontend-service.yaml
}

function deployBackend {
  oc apply -f $BASE_URL/backend-deployment.yaml
}

# Deprecated
function deployBackendService {
  oc apply -f $BASE_URL/backend-service.yaml
}

function exposeGuestbook {
  oc expose svc frontend
}

function exposeBackend {
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

function addSCC {
  oc create sa privileged
  oc adm policy add-scc-to-user privileged -z privileged
}

#createProject

#defineClusterImagePolicy
addSCC

#oc project guestbook
#deployRedisMaster
#deployRedisMasterService
#exposeRedisMaster

#deployRedisSlave
#deployRedisSlaveService

#deployBackend
#deployBackendService
#exposeBackend

deployFrontend
#deployFrontendService
#exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE

#ROUTE=$(obtainRoute redis-master)
#echo Redis master route: $ROUTE
