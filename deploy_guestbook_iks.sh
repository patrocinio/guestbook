BASE_URL=https://raw.githubusercontent.com/patrocinio/guestbook/redis_lock/

function createProject {
#  oc new-project guestbook
  kubectl create ns guestbook
}

function deployRedisMaster {
  kubectl apply -f $BASE_URL/redis-master-deployment.yaml
}

function deployRedisMasterService {
  kubectl apply -f $BASE_URL/redis-master-service.yaml
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
  kubectl apply -f $BASE_URL/ingress.yaml
}

function exposeBackend {
  kubectl expose svc backend
}

function exposeRedisMaster {
  kubectl delete route redis-master
  kubectl expose svc redis-master --port 6379
}

function obtainRoute {
  DOMAIN=$(ibmcloud ks cluster get  --cluster bo35iiqw0gsv1n9ok5jg | grep "Ingress Subdomain" | awk '{print $3}')
  echo $DOMAIN/guestbook
}

function defineClusterImagePolicy {
  kubectl apply -f cluster-image-policy.yaml
}

function defineRoleBinding {
  kubectl apply -f rolebinding.yaml
}

function addSCC {
  kubectl create sa privileged
  kubectl adm policy add-scc-to-user privileged -z privileged
}

createProject

#defineClusterImagePolicy
#addSCC

kubectl config set-context $(kubectl config current-context) --namespace guestbook

#deployRedisMaster
#deployRedisMasterService

#deployRedisSlave
#deployRedisSlaveService

#deployFrontend
#deployFrontendService
exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE

#ROUTE=$(obtainRoute redis-master)
#echo Redis master route: $ROUTE
