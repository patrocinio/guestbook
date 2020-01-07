function  createGuestbookConfigMap {
  kubectl delete configmap guestbook-config
  kubectl create configmap guestbook-config --from-literal=backend-url=backend-guestbook.patrocinio-iks-fa9ee67c9ab6a7791435450358e564cc-0000.us-east.containers.appdomain.cloud
}

kubectl config set-context $(kubectl config current-context) --namespace guestbook-application

createGuestbookConfigMap
