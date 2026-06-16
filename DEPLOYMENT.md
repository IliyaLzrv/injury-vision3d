# Deploying InjuryVision — Frontend on Vercel, Backend + Database on Render

This guide takes your app from "runs on my laptop" to "live on the internet" so you can
demo it in your presentation. It is written for your exact setup:

- **Backend**: Spring Boot 3.5 (Java 17, Maven), JWT auth
- **Frontend**: React 19 + Vite, axios already reads `VITE_API_BASE_URL`
- **Repo**: already on GitHub at `IliyaLzrv/injury-vision3d`

## The one thing you must understand first: the database

Right now your backend uses **H2 in-memory** (`jdbc:h2:mem:injuryvision`). That database
lives only in RAM. Every time the server restarts, **all data is wiped** — every account,
every record. That is fine for local testing but unusable for a hosted demo, because Render
restarts the service whenever it redeploys or wakes from sleep.

The fix is already half-done for you: the PostgreSQL driver is in `pom.xml` and there is
commented Postgres config in `application.properties`. You will create a real Postgres
database on Render and point the backend at it. You have **no seed data**, so after going
live you will just register a fresh account on the live site for your demo.

---

## Part 0 — Code changes you must make before deploying

Three things are hardcoded for local dev and will break in production. Make these edits,
commit, and push to GitHub.

### 0.1 — Make the database, port, and JWT secret read from environment variables

Open `backend/src/main/resources/application.properties`.

Replace the database block and JWT line so they read environment variables, falling back to
H2 locally. **Delete the hardcoded `spring.datasource.driver-class-name=org.h2.Driver` line**
— Spring Boot auto-detects the driver from the URL, so the same code works for both H2 (local)
and Postgres (Render).

Your edited file should contain:

```properties
spring.application.name=injuryvision

# --- Database: env-driven, H2 fallback for local dev ---
spring.datasource.url=${DB_URL:jdbc:h2:mem:injuryvision;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}
spring.datasource.username=${DB_USERNAME:sa}
spring.datasource.password=${DB_PASSWORD:}

# --- JPA / Hibernate ---
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 console (dev only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# --- Server port: Render injects PORT; default 8080 locally ---
server.port=${PORT:8080}

# --- JWT ---
jwt.secret=${JWT_SECRET:injuryvision-dev-secret-change-before-production-min-32-chars}
jwt.expiration-ms=86400000
```

`ddl-auto=update` means Hibernate creates your tables automatically on first boot against
Postgres — you do not need to write any SQL migrations.

### 0.2 — Make CORS allow your deployed frontend

Open `backend/src/main/java/com/injuryvision/config/SecurityConfig.java`. It currently
hardcodes `http://localhost:5173`, which will block your Vercel site.

Add a field that reads an env var:

```java
import org.springframework.beans.factory.annotation.Value;

// inside the class, near the top:
@Value("${FRONTEND_URL:http://localhost:5173}")
private String frontendUrl;
```

Then in `corsConfigurationSource()` change:

```java
configuration.setAllowedOrigins(List.of("http://localhost:5173"));
```

to:

```java
configuration.setAllowedOrigins(List.of(frontendUrl));
```

(Locally it still defaults to localhost:5173. On Render you'll set `FRONTEND_URL` to your
Vercel URL.)

### 0.3 — Add a Dockerfile for the backend

Render builds your Spring Boot JAR most reliably from a Dockerfile. Create a new file
`backend/Dockerfile` with exactly this:

```dockerfile
# Stage 1: build the jar
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Stage 2: slim runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/injuryvision-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### 0.4 — Commit and push

```bash
cd "injury-vision3d"
git add backend/src/main/resources/application.properties \
        backend/src/main/java/com/injuryvision/config/SecurityConfig.java \
        backend/Dockerfile
git commit -m "Make DB, port, JWT, CORS configurable for deployment"
git push
```

---

## Part 1 — Create the PostgreSQL database on Render

1. Go to https://render.com and sign up / log in with GitHub.
2. Click **New +** → **PostgreSQL**.
3. Name it `injuryvision-db`. Pick the **Free** plan and a region close to you (e.g. Frankfurt).
4. Click **Create Database** and wait ~1 minute until status is **Available**.
5. On the database page, find the **Connections** section. Note these values:
   - **Internal Database URL** (looks like `postgresql://USER:PASSWORD@dpg-xxxxx-a/DBNAME`)
   - The separate **Username**, **Password**, and **Hostname** (the internal host, ends in `-a`).

> Use the **internal** host (not external) because your backend will run on Render in the
> same region — it's faster and free of egress limits.

You will convert this into three env vars for the backend in Part 2. Spring needs a JDBC URL,
so you'll reformat the host into:
`jdbc:postgresql://<internal-host>/<DBNAME>`

---

## Part 2 — Deploy the backend on Render

1. In Render click **New +** → **Web Service**.
2. Connect your GitHub and select the **`injury-vision3d`** repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Render auto-detects the Dockerfile (shows "Docker"). Leave build/start
     commands empty — the Dockerfile handles them.
   - **Instance Type**: Free
   - **Region**: same region as your database
4. Scroll to **Environment Variables** and add:

   | Key            | Value                                                              |
   |----------------|-------------------------------------------------------------------|
   | `DB_URL`       | `jdbc:postgresql://<internal-host>/<DBNAME>` (from Part 1, step 5) |
   | `DB_USERNAME`  | the Postgres username from Part 1                                  |
   | `DB_PASSWORD`  | the Postgres password from Part 1                                  |
   | `JWT_SECRET`   | a random string of **at least 32 characters** (see below)         |
   | `FRONTEND_URL` | leave as `http://localhost:5173` for now; update it in Part 4     |

   Generate a JWT secret by running this locally and pasting the output:
   ```bash
   openssl rand -base64 48
   ```
   (`PORT` is provided automatically by Render — do not set it.)

5. Click **Create Web Service**. The first build takes a few minutes (it downloads Maven
   deps and compiles).
6. When the log shows `Started InjuryvisionApplication`, it's live. Your backend URL is
   shown at the top, e.g. `https://injuryvision-backend.onrender.com`.
7. Test it: open `https://<your-backend>.onrender.com/api/health` in a browser. You should
   get a response (this endpoint is public in your security config).

> **Free-tier cold starts**: a free Render backend sleeps after ~15 min of inactivity and
> takes ~50 seconds to wake. Before your presentation, open the `/api/health` URL once to
> wake it, and it'll stay warm while you demo.

---

## Part 3 — Deploy the frontend on Vercel

1. Go to https://vercel.com and sign up / log in with GitHub.
2. Click **Add New… → Project** and import the **`injury-vision3d`** repo.
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. Expand **Environment Variables** and add:

   | Key                 | Value                                              |
   |---------------------|----------------------------------------------------|
   | `VITE_API_BASE_URL` | `https://<your-backend>.onrender.com/api`          |

   Use the backend URL from Part 2, step 6, **with `/api` on the end** (your axios client
   expects that). No trailing slash after `/api`.
5. Click **Deploy**. After ~1 minute you get a URL like
   `https://injury-vision3d.vercel.app`.

---

## Part 4 — Connect the two (the step people forget)

Your backend's CORS still only allows localhost, so the live frontend can't talk to it yet.

1. Copy your Vercel URL (e.g. `https://injury-vision3d.vercel.app` — **no trailing slash**).
2. Back in Render → your **backend** service → **Environment** → edit `FRONTEND_URL` to that
   Vercel URL.
3. Save. Render automatically redeploys the backend (~1–2 min).

---

## Part 5 — Verify end to end

1. Open your Vercel URL in the browser.
2. Open DevTools (F12) → **Network** tab.
3. Register a new account. Watch the request to `…onrender.com/api/auth/register` return
   `200`/`201`. If you get a **CORS error**, `FRONTEND_URL` doesn't exactly match your Vercel
   URL — recheck Part 4. If you get a **timeout then success**, that was just the backend
   waking from sleep.
4. Log in, click around, confirm data loads.
5. Restart the backend (Render → **Manual Deploy → Clear build cache & deploy**, or just wait
   for a sleep/wake) and confirm your account **still exists**. That proves Postgres is
   persistent — the whole point of Part 0.

---

## Quick reference — every value you need to set

**Render backend env vars**
```
DB_URL        = jdbc:postgresql://<internal-host>/<dbname>
DB_USERNAME   = <postgres user>
DB_PASSWORD   = <postgres password>
JWT_SECRET    = <random 32+ char string>
FRONTEND_URL  = https://<your-app>.vercel.app
```

**Vercel frontend env var**
```
VITE_API_BASE_URL = https://<your-backend>.onrender.com/api
```

## Presentation-day checklist

- [ ] Open `https://<backend>.onrender.com/api/health` ~2 minutes before you present to wake it.
- [ ] Have one demo account already registered and tested.
- [ ] Open the Vercel URL in a fresh tab so the first page load is already done.
- [ ] Keep this file handy in case you need to re-check an env var.

## Common errors and fixes

| Symptom | Cause | Fix |
|---|---|---|
| CORS error in browser console | `FRONTEND_URL` ≠ Vercel URL | Match exactly, no trailing slash, redeploy backend |
| Login works locally but not live | `VITE_API_BASE_URL` missing `/api` or wrong | Fix Vercel env var, redeploy frontend |
| Backend 502 / takes ~50s first time | Free-tier cold start | Wake it before presenting (`/api/health`) |
| Data disappears after redeploy | Still on H2, not Postgres | Recheck `DB_URL` env var and that you removed the H2 driver line |
| Build fails on Render | Dockerfile path/jar name | Confirm `backend/Dockerfile` exists and jar name matches `injuryvision-0.0.1-SNAPSHOT.jar` |
