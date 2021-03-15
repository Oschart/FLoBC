mode=$(($1))
rm ModelMetadata 
npm start -- 9000 "models/test_model/data.csv" $mode