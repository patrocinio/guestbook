function createProject {
  oc new-project guestbook
}

function deployFrontend {
  oc delete -f frontend-deployment.yaml
  oc apply -f frontend-deployment.yaml
}

# Deprecated
function deployFrontendService {
  oc apply -f frontend-service.yaml
}

function exposeGuestbook {
  oc expose svc frontend
}

function exposeBackend {
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

function deployMongoOperator {
  oc delete -f mongodb-enterprise-openshift.yaml
  oc apply -f mongodb-enterprise-openshift.yaml
}

function createPullSecret {
#  cat ~/dockerconfig | base64 > .dockerconfigjson
#  oc delete secret openshift-pull-secrets
#  oc create secret generic openshift-pull-secrets --from-file=.dockerconfigjson
  oc create -f ~/patrocinio-secret.yml
}

function deployMongoDBPVC {
  oc create -f mongodb-pvc.yaml
}

function deployMongoDB {
  oc delete -f mongodb-statefulset.yaml
  oc create -f mongodb-statefulset.yaml
}

function exposeMongoDB {
  oc create -f mongodb-service.yaml
}


#createProject

#defineClusterImagePolicy
addSCC

oc project guestbook

# createPullSecret
# deployMongoOperator

#deployMongoDBPVC
#deployMongoDB
#exposeMongoDB

deployFrontend
#deployFrontendService
#exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE

#ROUTE=$(obtainRoute redis-master)
#echo Redis master route: $ROUTE
