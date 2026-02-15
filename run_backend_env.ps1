$env:SERVER_PORT="8081"
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="portfoliohappy_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="indigo@123"
$env:AI_API_URL="https://api.groq.com/openai/v1/chat/completions"
$env:AI_API_KEY="your_api_key_here"
$env:AI_API_MODEL="llama-3.3-70b-versatile"
$env:JWT_SECRET="your_jwt_secret_here"

mvn spring-boot:run
