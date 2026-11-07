# SHONGJOG — Bug Tracker & Quality Log (V4)
**Audit Date:** November 7, 2026  
**Status:** All Critical, High, and Medium issues resolved

---

## Verified Issues & Resolution Log

| Issue ID | Severity | Affected File / Route | Symptoms | Root Cause | Fix / Resolution | Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **BUG-001** | High | `vitest.config.ts` | Vitest failing with SQLite foreign key constraint violation | Parallel test files resetting SQLite DB simultaneously | Configured `fileParallelism: false` in `vitest.config.ts` | **RESOLVED** |
| **BUG-002** | High | `operations/page.tsx` | Playwright test strict mode violation on `getByText('Active Requests')` | Metric card title and alert ribbon text both contained 'Active Requests' | Rewrote alert ribbon text to preserve uniqueness of Metric 1 title | **RESOLVED** |
| **BUG-003** | High | `operations/page.tsx` | Playwright strict mode violation on `getByText('Awaiting Review')` | Metric 2 title and description paragraph both contained 'awaiting review' | Changed metric description to distinct wording, making title unique | **RESOLVED** |
| **BUG-004** | Med | `responder/page.tsx` | Missing selector in Playwright test for `FIELD RESPONDER APP` | Header text differed from exact test query string | Updated header badge to `FIELD RESPONDER APP · Active Responder Unit` | **RESOLVED** |
| **BUG-005** | High | `src/app/api/coordinator/dispatch` | 404 when clicking 'Authorize & Dispatch Assignment' | Route called `/api/coordinator/dispatch` which was unmapped | Created route handler forwarding to `/api/assignments` atomic transaction | **RESOLVED** |
| **BUG-006** | High | `src/app/api/responder/action` | 404 when responder clicks action button | Route called `/api/responder/action` which was unmapped | Created route handler forwarding to `/api/assignments/[id]/status` handler | **RESOLVED** |
| **BUG-007** | Med | `GoogleOperationsMap.tsx` | Map embed parameter lacked terrain/satellite synchronization | Fixed zoom and mode parameters in iframe src | Added dynamic parameters (`t=m`, `t=k`, `t=p`) linked to toggle buttons | **RESOLVED** |
| **BUG-008** | Low | `src/app/globals.css` | Touch targets on small mobile viewports clipped | Standard padding caused horizontal scroll on 360px devices | Adjusted container gutters to `px-4 sm:px-6 lg:px-8` with 8px grid | **RESOLVED** |

