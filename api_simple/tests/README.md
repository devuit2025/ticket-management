cd to api_simple
run docker exec -it api_simple-app-1 sh
run go test ./tests

if have any code update, need to rebuild it, and wait for 5 to 10 second to sure the server start completely