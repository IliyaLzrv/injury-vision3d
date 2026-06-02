# InjuryVision 3D

Sports self-tracking and recovery awareness web application for athletes. Users can visually track pain/injuries, recovery status, and weekly progress with an interactive 3D body model. **Not a medical diagnosis tool.**

## MVP (Phase 1–3) planned features

- Track pain/injury points on a body (later: interactive 3D body model)
- Capture recovery status over time (e.g., weekly check-ins)
- View simple progress insights and charts
- Basic user accounts (later phase)

## Tech stack (planned)

### Frontend

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Framer Motion
- Three.js + React Three Fiber + Drei

### Backend

- Java 21 + Spring Boot (Maven)
- Spring Web, Spring Data JPA, Spring Security, Validation
- JWT authentication (later phase)
- PostgreSQL (or MySQL)

## Folder structure

```text
.
├── backend/                 # Spring Boot API (Java)
├── frontend/                # React app (Vite)
├── docs/                    # Project documentation (Phase evidence)
│   ├── api/
│   ├── database/
│   ├── design/
│   ├── evidence/
│   ├── learning-outcomes/
│   ├── screenshots/
│   └── testing/
└── README.md
```

## Run the frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

## Run the backend

From the project root:

```bash
cd backend
./mvnw spring-boot:run
```

Backend health check:

- `GET http://localhost:8080/api/health`

## Medical disclaimer

InjuryVision 3D is for **self-tracking and awareness only**. It does **not** provide medical advice or diagnosis. If you have an injury or persistent pain, consult a qualified healthcare professional.

## Current project status

- **Phase 1 (Project Foundation)**: in progress
- Frontend initialized with Vite/React and Tailwind configured
- Backend initialized with Spring Boot and a health endpoint

