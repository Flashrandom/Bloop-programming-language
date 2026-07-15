# 🚀 BLOOP Compiler & Playground

A production-grade, full-stack open-source programming language playground for **BLOOP**, a custom dynamically typed interpreted programming language. 

Features a rich interactive React web interface with a sandboxed Spring Boot execution server, integrated Monaco Code Editor (with custom BLOOP syntax highlighting), live example presets, compiler pipeline visualization, and comprehensive documentation.

---

## 🎨 Features

* **Interactive Playground**: Write BLOOP scripts with full syntax highlighting, error indicators, and live execution.
* **Presaved Examples**: Dropdown selection to load and run preset BLOOP programs instantly.
* **Decoupled Architecture**: Spring Boot REST backend executing code independently for concurrent client requests.
* **Pipeline Visualization**: Interactive tab outlining the Compilation Steps: *Source Code ➔ Tokenizer ➔ Parser ➔ AST ➔ Interpreter*.
* **Custom Syntax Styling**: Tailored Monarch tokens provider inside Monaco Editor matching the dark theme design system.
* **Production-Grade Infrastructure**: Dockerized setup supporting multi-stage builds and automated CI/CD builds.

---

## 👥 The Bloop Brigade (Team & Contributions)

* **Afzl Raza** — Tokenizer Module (Lexical Analysis & Token Mapping)
* **Rani Kumari** — Parser Module (Syntactical Grammar & AST Construction)
* **Gaurav Rathore** — Instruction & Expression Module (AST Nodes & execution context)

---

## 🏛️ Pipeline Architecture

```mermaid
graph TD
    User([User's Browser]) -->|React SPA| FE[Vite + React Frontend]
    FE -->|REST API - POST /api/run| BE[Spring Boot Web Controller]
    BE -->|Service Layer| BS[BloopService]
    BS -->|Lex & Parse| IP[Interpreter Pipeline]
    IP -->|Tokenize| TK[Tokenizer]
    IP -->|Parse AST| PR[Parser]
    IP -->|Execute| EX[Execution Engine]
    EX -->|Writes to| ENV[Environment Output Buffer]
    ENV -->|Returns output/errors| BS
    BS -->|JSON DTO| BE
    BE -->|JSON Response| FE
```

Detailed documentation of each module can be found in the `/docs` folder:
* 🗺️ [Architecture Specification](docs/architecture.md)
* 🔤 [CFG EBNF Grammar](docs/grammar.md)
* 📖 [BLOOP Language Specification](docs/language-spec.md)

---

## 🚀 Running Locally

### 1. Prerequisites
* **Java 21 JDK** or newer
* **Node.js v18** or newer
* **Maven** (optional, wrapper/Docker handles packaging)

### 2. Launching the Spring Boot API
```bash
cd backend
mvn spring-boot:run
```
The REST API will be running on `http://localhost:8080`.

### 3. Launching the React SPA
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Containerization (Docker)

To run the entire application as a single production-grade container:

### Build and Run with Docker Compose
```bash
docker-compose up --build
```
This builds the React app, copies the compiled static assets into Spring Boot's resource assets folder, builds the Spring Boot JAR, and exposes the unified container on port `8080` (accessible via `http://localhost:8080`).

---

## 🌐 Deployment Specifications

### Frontend (Vercel)
The React SPA can be deployed on **Vercel**:
1. Connect your GitHub repository to Vercel.
2. Set root directory to `frontend`.
3. Set build command to `npm run build` and output directory to `dist`.
4. Configure environment variable (if separating API hosting) `VITE_API_URL` to point to your backend domain.

### Backend (Railway)
The Spring Boot application can be deployed on **Railway**:
1. Connect your repository to Railway.
2. Railway will detect the `Dockerfile` at the root and automatically build the multi-stage image.
3. Configure your server port variable `PORT` to `8080`.
