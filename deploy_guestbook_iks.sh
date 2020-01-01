BASE_URL=.

function createProject {
#  oc new-project guestbook
  kubectl create ns guestbook
}

function deployRedisMasterStorage {
  kubectl apply -f redis-master-pvc.yaml
}

function deployRedisMaster {
  kubectl apply -f $BASE_URL/redis-master-deployment.yaml
}

function deployRedisMasterService {
  kubectl apply -f $BASE_URL/redis-master-service.yaml
}

function deployRedisSlaveStorage {
  kubectl apply -f redis-slave-pvc.yaml
}



function deployRedisSlave {
  kubectl apply -f $BASE_URL/redis-slave-deployment.yaml
}

function deployRedisSlaveService {
  kubectl apply -f $BASE_URL/redis-slave-service.yaml
}

function deployFrontend {
  kubectl apply -f $BASE_URL/frontend-deployment.yaml
}

# Deprecated
function deployFrontendService {
  kubectl apply -f $BASE_URL/frontend-service.yaml
}

function exposeGuestbook {
  kubectl delete -f $BASE_URL/frontend-ingress.yaml
  kubectl apply -f $BASE_URL/frontend-ingress.yaml
}

function deployBackend {
  kubectl delete -f $BASE_URL/backend-deployment.yaml
  kubectl apply -f $BASE_URL/backend-deployment.yaml
}

function deployBackendService {
  kubectl delete -f $BASE_URL/backend-service.yaml
  kubectl apply -f $BASE_URL/backend-service.yaml
}

function exposeBackend {
  kubectl delete -f $BASE_URL/backend-ingress.yaml
  kubectl apply -f $BASE_URL/backend-ingress.yaml
}

function exposeRedisMaster {
  kubectl delete route redis-master
  kubectl expose svc redis-master --port 6379
}

function obtainRoute {
  kubectl get ingress $1 -o jsonpath='{@.spec.rules[0].host}'
}

function defineClusterImagePolicy {
  kubectl apply -f cluster-image-policy.yaml
}

function defineRoleBinding {
  kubectl apply -f rolebinding.yaml
}

function addSCC {
  kubectl create sa privileged
}

#createProject

#defineClusterImagePolicy
#addSCC

kubectl config set-context $(kubectl config current-context) --namespace guestbook

deployRedisMasterStorage
#deployRedisMaster
#deployRedisMasterService

deployRedisSlaveStorage
#deployRedisSlave
#deployRedisSlaveService

#deployBackend
#deployBackendService
#exposeBackend

#deployFrontend
#deployFrontendService
#exposeGuestbook

ROUTE=$(obtainRoute guestbook)
echo Frontend route: $ROUTE

ROUTE=$(obtainRoute backend)
echo Backend route: $ROUTE
