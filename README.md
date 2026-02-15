# AI Portfolio Generator

A production-ready web application to generate professional recruiter-friendly portfolios using AI.

## Prerequisites

- Java 17+
- Maven
- Node.js & npm
- MySQL Server

## Configuration

### 1. Database Setup
Create a MySQL database named `portfolio_db`:
```sql
CREATE DATABASE portfolio_db;
```
Expected credentials (configure in `src/main/resources/application.properties`):
- Username: `root`
- Password: `password` (Change this in the file to match your local setup)

### 2. AI API Key
Open `src/main/resources/application.properties` and update the AI configuration:
```properties
ai.api.url=https://api.openai.com/v1/chat/completions
ai.api.key=YOUR_ACTUAL_API_KEY_HERE
ai.model=gpt-3.5-turbo
```
**Note:** You can use any OpenAI-compatible API (e.g., LocalAI, Groq) by changing the URL and Model.

## Running the Application

### Backend (Spring Boot)
Open a terminal in the root directory (`c:\JAVA\PortfolioGenerator`) and run:
```bash
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend (React)
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies (if not already done):
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Usage
1. Open `http://localhost:5173`.
2. Fill in your Role, Skills, Experience, and Projects.
3. Click "Generate AI Bio".
4. Once generated, review the bio and click "Save Portfolio".
5. Navigate to "Saved Portfolios" to view all your entries.
