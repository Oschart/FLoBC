i=$(($1))
curl "http://127.0.0.1:9000/api/services/ml_service/v1/models/getmodel?version=$((i))"