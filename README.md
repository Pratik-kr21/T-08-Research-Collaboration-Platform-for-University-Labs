# T-08: Research Collaboration Platform for University Labs

## Domain
**Web Development · Cloud · Collaboration Tools**

## Problem Statement
Research students and faculty across departments lack a centralized platform to discover ongoing projects, share datasets, find collaborators, and track research milestones. Collaboration happens ad-hoc via email, causing duplication and missed synergies.

## Project Objectives
1. Create a research project registry with discovery and search
2. Implement collaborator matching based on skills and research interests
3. Enable dataset and resource sharing with access controls
4. Build a milestone tracker for ongoing research projects
5. Integrate academic publication linking (DOI/arXiv)
6. Provide department-level research portfolio pages

## Functional Requirements
- Faculty/student profile: research interests, skills, ongoing projects
- Project registry: title, abstract, domain tags, status, team size
- Search + filter: by domain, lab, skills required, open vs. closed
- Collaborator request workflow: invite, accept, decline
- Dataset library: upload, version, access level (public/request/private)
- Milestone tracker: phases, deadlines, progress %, PI sign-off
- Publication list: DOI linking, Google Scholar sync (optional)
- Department portfolio: aggregated view of all active research

## Non-Functional Requirements
| Attribute | Requirement |
| :--- | :--- |
| Performance | Search results < 1.5s for 500 projects |
| Scalability | 200 concurrent users |
| Security | Role-based (student, faculty, PI, admin) |
| Reliability | Daily backup for dataset library |
| Accessibility | Screen reader compatible |

## Suggested Technical Stack
| Layer | Option |
| :--- | :--- |
| Frontend | Next.js + Tailwind |
| Backend | Django REST Framework |
| Database | PostgreSQL + Elasticsearch (search) |
| Storage | MinIO (self-hosted S3) or AWS S3 |
| Auth | Django OAuth Toolkit / Auth0 |
| Optional | Celery for notifications |

## System Design Requirements
- **Architecture**: API-first design with a dedicated search service. The core Django backend handles CRUD for projects, profiles, and milestones. Elasticsearch indexes project abstracts and tags for full-text discovery. The dataset library manages versioned file uploads with signed URL access. The matching engine queries profiles for skill overlap with open collaboration requests. Notification service handles collaboration invites and milestone reminders.
- **Main Modules**: Profile Service, Project Registry, Search Indexer, Collaborator Matcher, Dataset Library, Milestone Tracker, Publication Linker, Notification Engine.
- **Data Flow**: Project Create → Elasticsearch Index → Search Query → Collaborator Match → Invite → Accept → Team Formed → Milestone Tracking.

## Expected Deliverables
- [ ] Source code
- [ ] Populated demo (20+ projects, 50+ profiles)
- [ ] Search relevance evaluation
- [ ] Dataset access control test cases
- [ ] Deployment guide
- [ ] Demo video (collaboration workflow end-to-end)

## Milestones & Timeline
| Week | Goal |
| :--- | :--- |
| 1 | DB schema + profile system + auth |
| 2 | Project registry + Elasticsearch setup |
| 3 | Search + filter + collaborator matching |
| 4 | Dataset library + access controls |
| 5 | Milestone tracker + publication linking |
| 6 | Department portfolio, notifications, testing |

## Evaluation Criteria
| Criterion | Marks |
| :--- | :--- |
| Search & Discovery Quality | 25 |
| Collaboration Workflow | 25 |
| Dataset Management | 20 |
| Code Quality & Security | 15 |
| Documentation & Presentation | 15 |

## Bonus Features
- AI-based collaborator recommendations (embedding similarity)
- Grant opportunity aggregator (RSS/web scraping)
- Citation network visualization
- Plagiarism-aware research note sharing

made under cusoc
