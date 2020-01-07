redis-cli -h patrocinio-iks-fa9ee67c9ab6a7791435450358e564cc-0000.us-east.containers.appdomain.cloud -p 30380 --cluster create --cluster-replicas 1 --verbose \
  169.63.141.194:30379 \
  169.63.141.194:30380 \
  169.63.141.194:30381 \
  169.60.81.202:30379 \
  169.60.81.202:30380 \
  169.60.81.202:30381
