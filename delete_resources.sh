oc delete svc backend
oc delete svc frontend
oc delete svc messaging
oc delete svc redis-master
oc delete svc redis-slave

oc delete deploy redis-master
oc delete deploy redis-slave
oc delete deploy backend
oc delete deploy consumer
oc delete deploy frontend
oc delete deploy messaging

oc delete pvc redis-master-pvc
oc delete pvc redis-slave-pvc

oc delete route backend
oc delete route frontend
