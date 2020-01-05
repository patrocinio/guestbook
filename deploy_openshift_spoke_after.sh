
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

oc project guestbook-application

exposeBackend
exposeGuestbook

ROUTE=$(obtainRoute frontend)
echo Frontend route: $ROUTE
