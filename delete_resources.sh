oc delete svc backend
oc delete svc frontend
oc delete svc messaging
oc delete svc redis-master
oc delete svc redis-slave

oc delete deploy redis-master
oc delete deploy redis-slave
oc delete deploy backend

oc delete pvc redis-master-pvc
oc delete pvc redis-slave-pvc
