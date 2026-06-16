# InjuryVision 3D — Manual Test Results

## Introduction

This document records the execution results for the InjuryVision 3D manual test plan ([manual-test-plan.md](./manual-test-plan.md)). It supports **IJ3D-27 US-18: Manual testing of core flows** and provides traceable evidence for the Sprint 3 MVP delivery.

Each test case is marked with a status, actual outcome, screenshot path, and optional notes or bug references. InjuryVision 3D is evaluated as a sports self-tracking and recovery awareness tool — not as a medical diagnosis product.

## Test Execution

| Field | Value |
| --- | --- |
| **Test execution date** | _YYYY-MM-DD_ |
| **Tester name** | _Your full name_ |
| **Environment** | Frontend: `http://localhost:5173` · Backend: `http://localhost:8080` |
| **Browser / OS** | _e.g. Chrome 131 / macOS 15_ |
| **Build / branch** | _e.g. main @ commit SHA_ |
| **Jira item** | IJ3D-27 US-18 |

---

## Results

| Test ID | Status | Actual Result | Evidence Screenshot Path | Notes / Bug Reference |
| --- | --- | --- | --- | --- |
| MT-01 | _Pass / Fail / Blocked / Not Run_ | _Describe what happened during registration_ | `docs/evidence/sprint-3/MT-01-register-success.png` | |
| MT-02 | _Pass / Fail / Blocked / Not Run_ | _Describe successful login and dashboard redirect_ | `docs/evidence/sprint-3/MT-02-login-success.png` | |
| MT-03 | _Pass / Fail / Blocked / Not Run_ | _Describe error shown for wrong password_ | `docs/evidence/sprint-3/MT-03-invalid-login.png` | |
| MT-04 | _Pass / Fail / Blocked / Not Run_ | _Describe redirect to login without token_ | `docs/evidence/sprint-3/MT-04-protected-route-redirect.png` | |
| MT-05 | _Pass / Fail / Blocked / Not Run_ | _Describe dashboard sections visible_ | `docs/evidence/sprint-3/MT-05-dashboard-loaded.png` | |
| MT-06 | _Pass / Fail / Blocked / Not Run_ | _Describe recovery overview card values_ | `docs/evidence/sprint-3/MT-06-recovery-overview-cards.png` | |
| MT-07 | _Pass / Fail / Blocked / Not Run_ | _Describe empty dashboard for new user_ | `docs/evidence/sprint-3/MT-07-dashboard-empty-state.png` | |
| MT-08 | _Pass / Fail / Blocked / Not Run_ | _Describe body map page load_ | `docs/evidence/sprint-3/MT-08-body-map-open.png` | |
| MT-09 | _Pass / Fail / Blocked / Not Run_ | _Describe selected body part panel_ | `docs/evidence/sprint-3/MT-09-body-part-selected.png` | |
| MT-10 | _Pass / Fail / Blocked / Not Run_ | _Describe created injury log details_ | `docs/evidence/sprint-3/MT-10-injury-log-added.png` | |
| MT-11 | _Pass / Fail / Blocked / Not Run_ | _Describe validation behaviour for invalid pain level_ | `docs/evidence/sprint-3/MT-11-pain-level-validation.png` | |
| MT-12 | _Pass / Fail / Blocked / Not Run_ | _Describe timeline after new log_ | `docs/evidence/sprint-3/MT-12-timeline-updated.png` | |
| MT-13 | _Pass / Fail / Blocked / Not Run_ | _Describe injury log list contents_ | `docs/evidence/sprint-3/MT-13-log-list-updated.png` | |
| MT-14 | _Pass / Fail / Blocked / Not Run_ | _Describe updated recovery status_ | `docs/evidence/sprint-3/MT-14-recovery-status-updated.png` | |
| MT-15 | _Pass / Fail / Blocked / Not Run_ | _Describe body part colour change_ | `docs/evidence/sprint-3/MT-15-body-part-color.png` | |
| MT-16 | _Pass / Fail / Blocked / Not Run_ | _Describe pain trend chart with data_ | `docs/evidence/sprint-3/MT-16-pain-trend-chart.png` | |
| MT-17 | _Pass / Fail / Blocked / Not Run_ | _Describe pain trend empty state_ | `docs/evidence/sprint-3/MT-17-pain-trend-empty.png` | |
| MT-18 | _Pass / Fail / Blocked / Not Run_ | _Describe saved training session_ | `docs/evidence/sprint-3/MT-18-training-load-created.png` | |
| MT-19 | _Pass / Fail / Blocked / Not Run_ | _Describe validation for invalid training input_ | `docs/evidence/sprint-3/MT-19-training-load-validation.png` | |
| MT-20 | _Pass / Fail / Blocked / Not Run_ | _Describe updated training load summary_ | `docs/evidence/sprint-3/MT-20-training-load-summary.png` | |
| MT-21 | _Pass / Fail / Blocked / Not Run_ | _Describe weekly report page load_ | `docs/evidence/sprint-3/MT-21-weekly-report-open.png` | |
| MT-22 | _Pass / Fail / Blocked / Not Run_ | _Describe weekly report sections with data_ | `docs/evidence/sprint-3/MT-22-weekly-report-data.png` | |
| MT-23 | _Pass / Fail / Blocked / Not Run_ | _Describe weekly report empty state_ | `docs/evidence/sprint-3/MT-23-weekly-report-empty.png` | |
| MT-24 | _Pass / Fail / Blocked / Not Run_ | _Describe PDF download and contents_ | `docs/evidence/sprint-3/MT-24-pdf-export.png` | Additional PDF pages: `MT-24-pdf-page2.png` |
| MT-25 | _Pass / Fail / Blocked / Not Run_ | _Describe disabled export button_ | `docs/evidence/sprint-3/MT-25-pdf-export-disabled.png` | |
| MT-26 | _Pass / Fail / Blocked / Not Run_ | _Describe logout and login redirect_ | `docs/evidence/sprint-3/MT-26-logout.png` | |

**Status legend**

| Status | Meaning |
| --- | --- |
| Pass | Actual result matches expected result |
| Fail | Actual result does not match expected result |
| Blocked | Test could not be executed (environment/data dependency) |
| Not Run | Test not executed in this cycle |

---

## Summary

| Metric | Count |
| --- | --- |
| Total test cases | 26 |
| Passed | _0_ |
| Failed | _0_ |
| Blocked | _0_ |
| Not run | _26_ |
| Pass rate | _0%_ |

## Defects Found

| Bug ID | Test ID | Severity | Description | Status |
| --- | --- | --- | --- | --- |
| _—_ | _—_ | _—_ | _No defects recorded yet_ | _—_ |

## Conclusion

_Overall assessment of MVP readiness after manual testing. Note any residual risks, known limitations, or follow-up items._

## Sign-off

| Role | Name | Date | Signature |
| --- | --- | --- | --- |
| Tester | _TBD_ | _TBD_ | |
| Reviewer | _TBD_ | _TBD_ | |
