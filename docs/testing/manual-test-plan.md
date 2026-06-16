# InjuryVision 3D — Manual Test Plan

## Introduction

This document describes the manual test plan for **InjuryVision 3D**, a sports self-tracking and recovery awareness web application. The purpose of manual testing is to verify that core MVP user flows work correctly from an end-user perspective before sprint delivery.

InjuryVision 3D helps athletes log self-tracked pain and recovery data, review training load context, and generate a weekly recovery summary for personal reflection or sharing with a coach or professional. The application does **not** provide medical diagnosis or treatment advice.

This test plan covers the complete MVP flow across authentication, dashboard, 3D body map, injury logging, training load analysis, weekly reporting, and PDF export.

## Testing Scope

| In scope | Out of scope |
| --- | --- |
| User registration and login | Automated unit/integration test execution |
| JWT-protected route access | Performance and load testing |
| Dashboard recovery overview and pain trend | Cross-browser compatibility matrix |
| 3D body map interaction and injury logs | Mobile native app behaviour |
| Injury log create, view, and update | Backend database administration |
| Training load logging and summary | Third-party deployment pipelines |
| Weekly recovery report page | Accessibility audit (WCAG) |
| Weekly report PDF export | Penetration/security testing |

## Environment

| Item | Value |
| --- | --- |
| Application | InjuryVision 3D MVP |
| Frontend | React + Vite (`http://localhost:5173` or configured `VITE_API_URL`) |
| Backend | Spring Boot (`http://localhost:8080` or configured API base URL) |
| Database | H2 (development) |
| Browser | Latest Chrome, Firefox, or Edge recommended |
| Jira reference | IJ3D-27 US-18 |

**Prerequisites**

1. Backend is running (`mvn spring-boot:run` from `backend/`).
2. Frontend is running (`npm run dev` from `frontend/`).
3. Browser dev tools are available for clearing `localStorage` when testing unauthenticated access.
4. Screenshot evidence is saved under `docs/evidence/sprint-3/`.

## Test Data Assumptions

| Account / data | Purpose |
| --- | --- |
| **New user** — e.g. `test.athlete@fontys.nl` | Registration and empty-state flows |
| **Existing user with data** — user who has injury logs and training loads | Dashboard cards, charts, weekly report, PDF export |
| **Invalid credentials** — wrong password for existing email | Negative login test |
| **Injury log** — body part e.g. left knee, pain level 1–10, recovery status | Body map, timeline, colour, and report tests |
| **Training load** — e.g. Running, 45 min, intensity 5 | Training load summary and weekly report |
| **Current calendar week** — Monday–Sunday | Weekly report filtering and PDF content |

Use unique email addresses for registration tests to avoid conflicts. For empty-state tests, use a freshly registered account with no logs.

---

## Test Cases

| Test ID | Feature | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| MT-01 | Register new user | Backend and frontend running; email not yet registered | 1. Open `/register`. 2. Enter full name, email, and password. 3. Submit registration. | Registration succeeds; user is signed in; browser redirects to dashboard or authenticated home. JWT is stored in `localStorage`. |
| MT-02 | Login existing user | User account exists | 1. Open `/login`. 2. Enter valid email and password. 3. Submit login. | Login succeeds; user lands on dashboard; welcome message shows user name/email. |
| MT-03 | Invalid login | User account exists | 1. Open `/login`. 2. Enter valid email with incorrect password. 3. Submit login. | Login fails; user-friendly error message is shown; user remains on login page; no dashboard access. |
| MT-04 | Protected route without token | User is not authenticated; `localStorage` token cleared | 1. Clear browser `localStorage` (or use private window). 2. Navigate directly to `/dashboard` (or `/body-map`, `/reports/weekly`). | User is redirected to `/login`; protected content is not displayed. |
| MT-05 | Dashboard loads | User is authenticated | 1. Log in. 2. Open `/dashboard`. | Dashboard loads with welcome text, product disclaimer, recovery section, pain trend section, training load section, and navigation cards (Body Map, Weekly Report, Logout). |
| MT-06 | Recovery overview cards show data | Authenticated user with at least one injury log | 1. Log in as user with injury data. 2. Open dashboard. 3. Review recovery overview cards. | Cards display self-tracked recovery metrics (e.g. total logs, active areas, average/highest pain, recovering count) based on user's data. |
| MT-07 | Dashboard empty state for new user | Freshly registered user with no injury logs | 1. Register or log in as new user. 2. Open dashboard. 3. Review recovery overview and pain trend. | Overview cards show zero/empty values; pain trend shows empty-state message guiding user to body map; no errors. |
| MT-08 | Open 3D Body Map | User is authenticated | 1. From dashboard, click **Open 3D Body Map** (or navigate to `/body-map`). | Body map page loads with 3D model, legend, product disclaimer, timeline, and injury log list areas. |
| MT-09 | Select body part | User is on body map page | 1. Click a body part on the 3D model (e.g. left knee). | Selected body part panel appears with part name and option to add injury log. |
| MT-10 | Add injury log | Body part selected on body map | 1. Click **Add Injury Log**. 2. Choose injury type, pain level (1–10), recovery status, optional notes. 3. Save. | Modal closes; new log appears in injury log list; success without page error. |
| MT-11 | Pain level validation (invalid) | Body map open; add injury log modal open | 1. Attempt to submit pain level outside 1–10 (e.g. `0` or `11`) via browser dev tools or by clearing `min`/`max` if needed, or leave required field empty. 2. Submit form. | Browser HTML5 validation prevents invalid submit **or** API returns validation error; log is not saved with invalid pain level. |
| MT-12 | Injury timeline updates | At least one injury log exists | 1. Open body map. 2. Add a new injury log (MT-10). 3. Observe injury timeline. | Timeline includes the new entry in chronological order with body part, date, and pain/recovery info. |
| MT-13 | Injury log list updates | At least one injury log exists | 1. Open body map. 2. Add or update a log. 3. Review injury log list. | List reflects latest logs with correct body part, pain level, recovery status, and notes. |
| MT-14 | Update injury/recovery status | User owns at least one injury log | 1. On body map, open **Edit** on an existing log. 2. Change recovery status (e.g. Active → Recovering). 3. Save. | Updated status appears in log list and timeline; changes persist after page refresh. |
| MT-15 | Body part colour updates | User has multiple logs for same body part | 1. Log higher pain on a body part. 2. Observe 3D model colour for that part. 3. Add later log with lower pain on same part. | Body part colour reflects the **latest** log's pain level per legend (e.g. green/yellow/orange/red thresholds). |
| MT-16 | Pain trend chart shows data | Authenticated user with injury logs | 1. Open dashboard. 2. Scroll to pain trend chart. | Chart displays self-tracked pain data points over time with readable axes and tooltips. |
| MT-17 | Pain trend chart empty state | New user with no injury logs | 1. Log in as user without logs. 2. Open dashboard pain trend section. | Empty-state message is shown with link/guidance to body map; chart does not crash. |
| MT-18 | Create training load | User is authenticated | 1. On dashboard, complete **Log training session** form (type, duration ≥ 1 min, intensity 1–10). 2. Submit. | Success message appears; session is saved. |
| MT-19 | Training load validation | Training load form visible | 1. Enter duration `0` or intensity `11` (or leave required fields empty). 2. Submit. | Browser validation blocks submit **or** API returns validation error; invalid session is not saved. |
| MT-20 | Training load summary updates | User has saved training loads | 1. Log a new training session (MT-18). 2. Review **Training load summary** card. | Summary updates with new session, load score, and weekly reflection label (Low/Moderate/High). |
| MT-21 | Open weekly report | User is authenticated | 1. From dashboard, click **Open Weekly Report** (or navigate to `/reports/weekly`). | Weekly recovery report page loads with title, current week range, and disclaimer. |
| MT-22 | Weekly report with data | User has injury logs and/or training loads in current week | 1. Open weekly report. 2. Review all sections. | Page shows summary cards, weekly pain trend, weekly injury logs, training load reflection, and product disclaimer. |
| MT-23 | Weekly report empty state | User has no injury logs and no training loads | 1. Log in as empty user. 2. Open weekly report. | Empty-state message with links to body map and dashboard; export button disabled. |
| MT-24 | Export weekly report PDF | Weekly report has data; export enabled | 1. Open weekly report with data. 2. Click **Export PDF**. 3. Wait for export to complete. 4. Open downloaded file. | `injuryvision-weekly-report.pdf` downloads; PDF contains report title, week range, generated date, summary, chart, logs, training reflection, and disclaimer; wording remains recovery-awareness focused (not medical report). |
| MT-25 | PDF disabled when no data | Weekly report empty state (MT-23) | 1. Open weekly report with no data. 2. Observe **Export PDF** button. | Export button is disabled; no PDF is generated on click. |
| MT-26 | Logout | User is authenticated | 1. On dashboard, click **Logout**. | Session ends; token removed; user redirected to login; protected routes no longer accessible without login. |

---

## Evidence

Capture screenshots for each executed test and store them using the naming convention:

`docs/evidence/sprint-3/MT-XX-short-description.png`

Record results in [manual-test-results.md](./manual-test-results.md).

## Sign-off

| Role | Name | Date | Signature |
| --- | --- | --- | --- |
| Tester | _TBD_ | _TBD_ | |
| Reviewer | _TBD_ | _TBD_ | |
