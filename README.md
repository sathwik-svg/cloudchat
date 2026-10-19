# CloudChat — Real-Time Messaging Platform

**A self-hosted messaging application built with Node.js, Express, Socket.IO, and PostgreSQL.**

CloudChat is a hands-on software engineering project focused on real-time communication, persistent data storage, containerisation, and Linux server deployment. It demonstrates practical experience building and running an application in a self-managed environment.

## 🚀 Project Overview

CloudChat combines a web-based chat interface with a Node.js backend, real-time communication through Socket.IO, and PostgreSQL for message storage.

### Key Features

- Real-time messaging architecture using Socket.IO
- Backend API built with Node.js and Express
- PostgreSQL database integration
- Containerised deployment using Podman
- Persistent database storage
- Health-check endpoint for service monitoring
- Ubuntu Linux home-server deployment
- Custom web interface with CSS styling and animations

## 🏗️ Architecture

```text
                 Web Browser
                      |
                      v
             CloudChat Frontend
              HTML / CSS / JS
                      |
                      v
          Node.js + Express Server
                 Socket.IO
                      |
             +--------+--------+
             |                 |
             v                 v
          REST API        Real-time Events
             |
             v
          PostgreSQL
       Persistent Storage
```

### Deployment Architecture

```text
Ubuntu Linux Home Server
          |
          v
      Podman
          |
     +----+----------------+
     |                     |
     v                     v
 CloudChat App        PostgreSQL
 Port 3001            Port 5432
     |
     v
 Health Check
 /api/health
```

## 🧰 Technology Stack

| Area | Technologies |
|---|---|
| Backend | Node.js, Express |
| Real-time communication | Socket.IO |
| Database | PostgreSQL |
| Frontend | HTML, CSS, JavaScript |
| Containers | Podman |
| Operating system | Ubuntu Linux |
| Version control | Git, GitHub |

## ⚙️ Running Locally

### Prerequisites

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sathwik-svg/cloudchat.git
cd cloudchat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file using the variable names expected by the application. Configure the PostgreSQL connection string according to your local database.

**Never commit `.env` files, passwords, or database credentials.**

### 4. Start the application

Use the start command defined in `package.json`. For example, if the project defines `npm start`:

```bash
npm start
```

Open the local address and port configured by the application.

## 🩺 Health Monitoring

CloudChat exposes a health endpoint:

```text
GET /api/health
```

This endpoint can be used to check whether the application is responding and its database connection is healthy.

## 🐧 Linux & Container Operations

The project is deployed on an Ubuntu home server using Podman. This provides practical experience with:

- Building and running container images
- Configuring application networking
- Managing application environment variables
- Connecting application and database containers
- Running health checks
- Restarting and troubleshooting services
- Managing changes through Git and GitHub

## 🔐 Security Considerations

- Keep database credentials outside the source code.
- Exclude environment files and secrets from Git.
- Avoid exposing the PostgreSQL port publicly.
- Use a reverse proxy and HTTPS before exposing the application to the internet.
- Add authentication, authorisation, rate limiting, and input validation before production use.

## 🗺️ Future Improvements

- User registration and authentication
- Private chat rooms and group conversations
- Improved message history and pagination
- Automated tests and continuous integration
- Structured logging and application metrics
- HTTPS and reverse-proxy deployment
- Automated backup and database recovery procedures

## 👨‍💻 About the Developer

I'm a Computer Science and Engineering student at **Vasireddy Venkatadri Institute of Technology (VVIT)**, India, building practical projects in cloud computing, Linux, software engineering, and DevOps.

My long-term goal is to develop the skills needed to work as a **Cloud Engineer, DevOps Engineer, or Site Reliability Engineer**, with a focus on reliable systems, automation, and production-oriented engineering.

I value hands-on learning, clear documentation, troubleshooting, and continuously improving software through practical projects.

## 🔗 Project Links

- **GitHub Repository:** https://github.com/sathwik-svg/cloudchat
- **Developer Portfolio:** https://portfolio-wuht.onrender.com
- **LinkedIn:** https://www.linkedin.com/in/sathwik-ganji-a80b143b5

---

*Built as a practical learning project exploring real-time applications, containerisation, and Linux-based deployment.*
