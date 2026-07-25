# Engineer Finder

Finds publicly indexed LinkedIn profiles for engineers at given companies, and ranks them
by relevance using an LLM — without scraping LinkedIn directly (which violates their ToS
and gets blocked quickly).

**How it works:**
1. User enters company names (e.g. "Groww, Razorpay, JPMC") in the React UI.
2. Spring Backend calls **Groq's LLM API** inorder to exctract company and role name from the user input given by the user.
2. After that backend calls **Tavily Search API**, scoped to `linkedin.com`, to find
   publicly indexed LinkedIn profile pages matching each company + role provided by user.
3. The raw search snippets are sent to **Groq's LLM API** (Llama 3.3 70B), which ranks
   them by apparent seniority/relevance and writes a one-line reason for each match.
4. Results are returned to the React frontend as ranked cards with LinkedIn links.
5. We also provide user with more similar options like search for engineers at **Microsoft**,**Salesforece** etc. and all are clickable.


## Architectural Diagram
![img.png](img.png)

## Overview
![img_1.png](img_1.png)
## Prerequisites

- Java 17+, Maven
- Node.js 18+
- A **Tavily API key** (free tier: 1,000 searches/month, no card required)
  → sign up at https://tavily.com
- A **Groq API key** (free, rate-limited, no card required)
  → sign up at https://console.groq.com

## Backend setup

```bash
cd backend
export TAVILY_API_KEY=your_tavily_key_here
export GROQ_API_KEY=your_groq_key_here
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`. Health check: `GET /api/health`.

## Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` and calls the backend at `localhost:8080`.

## API

`POST /api/search`

Request body:
```json
{
  "companies": ["Groww", "Razorpay", "JPMC"],
  "roleFilter": "Backend Engineer"
}
```

Response body:
```json
[
  {
    "name": "Jane Doe",
    "title": "Senior Backend Engineer",
    "company": "Razorpay",
    "linkedinUrl": "https://linkedin.com/in/janedoe",
    "matchReason": "Senior title with mentions of distributed systems experience.",
    "relevanceScore": 87
  }
]
```


