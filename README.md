# InterviewIQ — Real-Time Interview Platform

A full-stack, real-time coding interview platform designed to simulate professional technical interviews with live collaboration, code execution, and automated feedback.

---

## Features

- **Live Pair Programming**
  - Real-time collaborative code editor
  - Multi-language support (JavaScript, Python, Java)
  - Instant code execution with output

- **Integrated Video & Audio**
  - 1-on-1 interview sessions
  - Camera/mic controls and screen sharing

- **Real-Time Communication**
  - WebSocket-based low-latency updates
  - Live participant tracking and session sync

- **Smart Evaluation System**
  - Test-case based automatic grading
  - Immediate feedback on code submissions

- **Practice Mode**
  - Curated DSA problems (Easy → Hard)
  - Self-paced learning with structured progression

- **Analytics Dashboard**
  - Live sessions tracking
  - Historical performance insights

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS + DaisyUI
- TanStack Query

### Backend
- Node.js + Express
- WebSockets
- JWT Authentication (Clerk)

### DevOps & Cloud
- Docker (Containerization)
- Jenkins (CI/CD Automation)
- Terraform (Infrastructure as Code)
- AWS ECS Fargate (Container Orchestration)
- AWS ECR (Image Registry)
- AWS CloudWatch (Monitoring & Logs)

### Deployment
- Vercel (Frontend)
- Render (Backend)
- AWS (Automated Infra - Tested)

---

## CI/CD Pipeline

1. Code pushed to GitHub
2. Jenkins triggers pipeline
3. Docker image is built
4. Image pushed to AWS ECR
5. Terraform provisions/updates infrastructure
6. ECS Fargate deploys updated container
7. CloudWatch monitors logs & metrics

---

## Real-World Use Cases

- Technical interview platforms (like LeetCode, HackerRank)
- Remote hiring and evaluation systems
- Collaborative coding environments for teams
- Online coding bootcamps and training platforms

---

## Future Enhancements

- AI-based interview feedback & suggestions
- Auto-scaling infrastructure using AWS policies
- Recording & replay of interview sessions
- Multiplayer coding rooms (panel interviews)
- Blue-Green deployments for zero downtime

---

## Key Highlights

- Built a **real-time distributed system**
- Implemented **end-to-end DevOps automation**
- Designed for **scalability, reliability, and low latency**
- Simulates **industry-level coding interview environments**

---

## Live Demo

👉 https://interview-iq-gamma.vercel.app/

---

## Repository

👉 https://github.com/neellokhandwala/InterviewIQ

---

## 👨‍💻 Author

**Neel Lokhandwala**
