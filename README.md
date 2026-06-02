# InjuryVision 3D

**InjuryVision 3D** is a sports-health web application that helps athletes visually track injuries, pain levels, recovery progress, and training load using an interactive 3D body model.

The application is designed for athletes, basketball players, gym users, runners, coaches, and sport students who want a clearer and more structured way to monitor pain and recovery over time.

Instead of writing injury notes in random documents or trying to remember pain history, users can open a 3D body map, select a specific body part, and log pain or recovery information. The selected body parts are visually highlighted based on injury severity, giving the user a clear overview of their current physical condition.

> **Important:** InjuryVision 3D is not a medical diagnosis tool. It is a sports self-tracking and recovery awareness application.

---

## Project Overview

Many athletes experience small injuries, muscle pain, soreness, or recurring discomfort during training and competition. However, these problems are often not tracked properly. This can make it difficult to notice patterns, understand when pain is getting worse, or decide when to reduce training intensity.

InjuryVision 3D solves this by giving users a visual and structured system for tracking pain and recovery. The core feature is an interactive 3D body model where users can click body parts such as the knee, ankle, shoulder, back, wrist, hamstring, or lower back and create injury logs.

Each body part can change color depending on the current status:

* **Green** — Healthy or recovered
* **Yellow** — Light pain
* **Orange** — Moderate pain
* **Red** — High pain
* **Blue** — Currently recovering

The goal is to help athletes become more aware of their physical condition and recognize injury patterns before they become bigger problems.

---

## Problem Statement

Athletes often deal with pain, soreness, and minor injuries, but they do not always track them consistently. This can lead to forgotten symptoms, repeated overload, unclear recovery progress, and difficulty understanding how training intensity affects the body.

Traditional notes or simple fitness apps do not always provide a visual overview of injury areas. InjuryVision 3D addresses this by combining injury logging, recovery tracking, training load awareness, and an interactive 3D body map in one application.

---

## Target Users

The application is designed for:

* Basketball players
* Gym users
* Runners
* Sport students
* Coaches
* General athletes
* People who want to monitor recurring pain or recovery after training

The project focuses mainly on athletes who want to understand their pain patterns and recovery progress in a simple and visual way.

---

## Main Features

### MVP Features

The MVP focuses on the core injury tracking flow:

1. User login and registration
2. Interactive 3D body model
3. Clickable body parts
4. Injury and pain logging
5. Pain level tracking
6. Recovery status tracking
7. Injury history timeline
8. Dashboard with injury and recovery overview
9. Weekly injury/recovery report

---

## Optional Challenge Features

The following features are planned as optional improvements if time allows:

1. Upload injury images or reports
2. PDF export of weekly recovery reports
3. Rule-based AI-style recovery recommendations
4. Training load analysis
5. More detailed body zones
6. Mobile PWA offline mode

These features are not required for the MVP but can improve the usefulness and professional quality of the application.

---

## Core User Flow

The main user flow of InjuryVision 3D is:

```text
Login/Register
→ Dashboard
→ Open 3D Body Map
→ Click Body Part
→ Selected Body Part Panel Opens
→ Add New Injury Log
→ Save Log
→ Body Part Color Updates
→ Dashboard, Injury History, and Weekly Report Update
```

Example scenario:

A basketball player feels knee pain after training. The user logs in, opens the 3D Body Map, clicks on the right knee, adds a pain level of 6/10, writes a note such as “Pain after basketball training,” and saves the log. The right knee changes color based on the pain severity, and the dashboard updates the injury overview.

---

## Pages / Screens

The application contains the following main screens:

### Login Page

Allows existing users to log in to their account.

### Register Page

Allows new users to create an account.

### Dashboard

Shows an overview of the user's injury and recovery status.

Possible dashboard cards:

* Active injuries
* Average pain level
* Injury risk level
* Recovery progress
* Most affected body part
* Weekly pain trend

### 3D Body Map

The main interactive feature of the application.

Users can:

* Rotate and view the 3D body model
* Click body parts
* View injury status by color
* Open the selected body part panel
* Add new injury logs

### Add Injury Log Modal / Panel

Allows users to add pain or injury information for a selected body part.

Fields may include:

* Selected body part
* Pain level
* Recovery status
* Activity type
* Injury description
* Notes
* Date

### Injury History

Shows previous injury logs in a timeline format.

Users can review:

* Body part
* Pain level
* Date
* Recovery status
* Notes
* Activity context

### Weekly Recovery Report

Summarizes injury and recovery data for the week.

The report may include:

* Average pain level
* Most affected body part
* Pain trend
* Training load summary
* Recovery suggestion
* Weekly progress

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Axios
* Recharts
* Framer Motion
* Three.js / React Three Fiber

### Backend

* Spring Boot
* REST API
* JWT authentication
* JPA / Hibernate
* PostgreSQL or MySQL

### Tools

* GitHub
* Jira or Trello
* Figma
* Postman
* IntelliJ IDEA / Visual Studio Code
* Git

---

## Planned Project Structure

```text
injuryvision-3d/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── src/main/java/
│   │   └── com/injuryvision/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── domain/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── repository/
│   │       ├── service/
│   │       └── security/
│   └── pom.xml
│
├── docs/
│   ├── project-plan/
│   ├── research/
│   ├── ux-ui/
│   ├── architecture/
│   ├── testing/
│   └── reflection/
│
└── README.md
```

---

## Main Backend Models

The backend will likely include the following main models.

### User

Represents a registered user.

Possible fields:

* id
* name
* email
* password
* sport
* createdAt

### InjuryLog

Represents an injury or pain log created by a user.

Possible fields:

* id
* userId
* bodyPart
* painLevel
* recoveryStatus
* activityType
* description
* notes
* createdAt

### TrainingLog

Represents training load information.

Possible fields:

* id
* userId
* activityType
* duration
* intensity
* loadScore
* date

### RecoveryReport

Represents a weekly recovery summary.

Possible fields:

* id
* userId
* weekStart
* weekEnd
* averagePainLevel
* mostAffectedBodyPart
* riskLevel
* recommendation

---

## API Endpoint Ideas

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Injury Logs

```http
POST /api/injury-logs
GET /api/injury-logs
GET /api/injury-logs/{id}
GET /api/injury-logs/body-part/{bodyPart}
PUT /api/injury-logs/{id}
DELETE /api/injury-logs/{id}
```

### Dashboard

```http
GET /api/dashboard/summary
GET /api/dashboard/pain-trends
GET /api/dashboard/recovery-overview
```

### Weekly Report

```http
GET /api/reports/weekly
GET /api/reports/weekly/export
```

### Training Load

```http
POST /api/training-logs
GET /api/training-logs
GET /api/training-logs/weekly-summary
```

---

## 3D Body Map Concept

The 3D Body Map is the central feature of InjuryVision 3D.

The body model is divided into clickable zones. Each zone represents a body part, such as:

* Left knee
* Right knee
* Left ankle
* Right ankle
* Shoulder
* Wrist
* Hamstring
* Lower back
* Upper back
* Neck

When a user clicks a body part, the application opens a side panel or modal where the user can view previous logs and create a new injury log.

The body part color is calculated based on the latest pain level or recovery status.

Example logic:

```text
Pain level 0 = Green
Pain level 1–3 = Yellow
Pain level 4–6 = Orange
Pain level 7–10 = Red
Recovery status active = Blue
```

---

## Training Load Analysis

Training load analysis helps connect training intensity with pain or injury patterns.

A simple training load score can be calculated using:

```text
Training Load = Duration x Intensity
```

Example:

```text
90 minutes x intensity 7 = 630 load score
```

This can help the user understand whether increased pain may be related to high training intensity.

Example insight:

```text
Your training load was high this week, and knee pain increased from 4/10 to 7/10.
Consider reducing training intensity and monitoring recovery.
```

The recommendation is general and should not be treated as medical advice.

---

## AI-Style Recovery Recommendations

The application may include rule-based recovery suggestions. These are not generated by medical AI and are not medical advice.

Example logic:

```text
Pain level 1–3:
Light discomfort detected. Monitor the area and continue training carefully.

Pain level 4–6:
Moderate pain detected. Consider reducing training intensity and focusing on recovery.

Pain level 7–10:
High pain detected. Avoid heavy training and consider speaking with a professional.
```

This feature is designed to make the app more useful while keeping the advice safe and general.

---

## UX/UI Design

The design goal is to make the application:

* Clean
* Modern
* Bright
* Sport-focused
* Easy to understand
* Fast to use after training

The low-fidelity wireframes were created in Figma and validated using feedback from three athlete-type users:

* Basketball player
* Gymnastics athlete
* Soccer player

The test scenario was:

```text
Imagine you have knee pain after training. Use these wireframes to show how you would log the pain and then check your recovery overview.
```

Main feedback findings:

* Users understood the purpose of the app.
* Users liked the dashboard and the Open 3D Body Map button.
* Users understood that the 3D Body Map is the main feature.
* Users wanted clickable body zones to be more obvious.
* Users liked the Add Injury Log modal but wanted activity/training context.
* Users found the Injury History timeline easy to scan.
* Users liked the Weekly Recovery Report but wanted suggestions to remain non-medical.

Design changes after feedback:

* Added clearer dashboard insight text.
* Added helper explanation under Injury Risk.
* Improved 3D Body Map interaction labels.
* Added body zone labels such as knee, ankle, shoulder, wrist, hamstring, and lower back.
* Improved Add Injury Log modal labels.
* Added Activity Type to the injury log form.
* Added clearer filter explanation to Injury History.
* Added safer wording for Smart Recovery Suggestions.

---

## Documentation

The project includes professional documentation for planning, research, design, architecture, testing, and reflection.

Planned documentation:

1. Project Plan
2. Research Document
3. Competitor Analysis
4. UX/UI Design Document
5. Architecture / Technical Design Document
6. Testing & Validation Document
7. Reflection Document
8. Learning Outcomes Evidence Document

---

## Development Planning

The project is planned across three one-week sprints.

### Sprint 1 — Foundation

Focus:

* Project setup
* Frontend initialization
* Backend initialization
* Database setup
* Basic authentication
* Static page structure
* Initial UI layout

### Sprint 2 — Core Features

Focus:

* Injury logging CRUD
* 3D Body Map prototype
* Clickable body parts
* Selected body part panel
* Body part color logic
* Injury history timeline

### Sprint 3 — Dashboard, Reports, Testing, Polish

Focus:

* Dashboard statistics
* Pain trend charts
* Weekly recovery report
* Training load analysis
* Rule-based recommendations
* Testing and validation
* UI polish
* Final documentation updates

---

## Definition of Done

A feature is considered done when:

* It is implemented in the frontend and/or backend
* It matches the MVP requirements
* It is connected to real or mocked data
* It has been manually tested
* It does not break existing features
* It is committed to Git with a clear message
* Screenshots or evidence are saved when needed
* The feature is documented if relevant

---

## Testing Strategy

Testing will include:

* Manual testing
* API testing with Postman
* Unit testing for backend services
* Authentication testing
* Injury logging flow testing
* Dashboard data validation
* Usability testing with users

Example test cases:

* User can register successfully.
* User can log in successfully.
* Protected routes require authentication.
* User can open the 3D Body Map.
* User can click a body part.
* User can create an injury log.
* Body part color changes based on pain level.
* Injury history shows saved logs.
* Dashboard updates after a new log.
* Weekly report displays correct summary data.

---

## Project Status

Current phase:

```text
Planning and UX/UI low-fidelity phase completed.
Implementation phase starting.
```

Completed:

* Project concept
* Project documentation
* Jira/Trello board
* Low-fidelity wireframes
* User flow
* User feedback sessions
* UX/UI design iteration

Next steps:

* Initialize frontend
* Initialize backend
* Set up database
* Implement authentication
* Build injury logging flow
* Build 3D Body Map interaction
* Build dashboard and weekly report

---

## How to Run the Project

This section will be updated during implementation.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

---

## Disclaimer

InjuryVision 3D is a sports self-tracking and recovery awareness application. It is not a medical device and does not provide medical diagnosis, treatment, or professional medical advice. Users should consult a qualified professional for serious injuries, persistent pain, or medical concerns.

---

## Author

Created as a 3-week individual software engineering project.

**Project:** InjuryVision 3D
**Category:** Sports-health tracking, 3D visualization, recovery awareness
**Main technologies:** React, Vite, React Three Fiber, Spring Boot, REST API, JWT, SQL database
