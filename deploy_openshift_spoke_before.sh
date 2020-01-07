function  createGuestbookConfigMap {
  oc delete configmap guestbook-config
  oc create configmap guestbook-config --from-literal=backend-url=backend-guestbook-application.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud
}

oc project guestbook-application

createGuestbookConfigMap
