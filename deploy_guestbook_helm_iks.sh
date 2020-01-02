cd helm
helm package guestbook
helm delete --purge guestbook
helm install guestbook -n guestbook --namespace guestbook -f guestbook/values-iks.yaml
