# 🚀 Cloud-Native Inventory Management Platform

A production-style, containerized **Inventory Management Platform** designed and deployed as a hands-on **DevOps and Cloud Engineering project**.

The project demonstrates an end-to-end workflow covering **application development, Git-based version control, CI automation, containerization, cloud deployment, infrastructure management, reverse proxy configuration, database persistence, authentication, and infrastructure monitoring**.

---

## 📌 Project Overview

The goal of this project was to build an inventory management application and deploy it using modern DevOps practices.

The application consists of a backend service, PostgreSQL database, and Nginx reverse proxy. These components are containerized using Docker Compose and deployed on an AWS EC2 environment.

The project also includes a GitHub Actions CI pipeline and AWS CloudWatch monitoring.

---

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     Developer    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      GitHub      │
                    │  Source Control  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  GitHub Actions  │
                    │       CI         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      Docker      │
                    │   Containers     │
                    └────────┬─────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │          AWS EC2            │
              │                             │
              │  ┌───────────────────────┐  │
              │  │        Nginx          │  │
              │  │    Reverse Proxy      │  │
              │  └───────────┬───────────┘  │
              │              │              │
              │              ▼              │
              │  ┌───────────────────────┐  │
              │  │    Node.js / Express  │  │
              │  │     Application       │  │
              │  └───────────┬───────────┘  │
              │              │              │
              │              ▼              │
              │  ┌───────────────────────┐  │
              │  │      PostgreSQL       │  │
              │  │       Database        │  │
              │  └───────────────────────┘  │
              └─────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  AWS CloudWatch  │
                    │ Monitoring/Alarm │
                    └──────────────────┘
```

---

## 🔄 DevOps Workflow

```text
Developer
    │
    ▼
Git / GitHub
    │
    ▼
GitHub Actions
    │
    ├── Checkout source code
    ├── Setup Node.js
    ├── Install dependencies
    ├── Build Docker image
    └── Verify Docker image
    │
    ▼
Docker / Docker Compose
    │
    ▼
AWS EC2
    │
    ├── Nginx
    ├── Node.js Application
    └── PostgreSQL
    │
    ▼
AWS CloudWatch
    │
    └── Infrastructure Monitoring
```

---

## 🛠️ Technology Stack

### Application

* Node.js
* Express.js
* HTML
* CSS
* JavaScript

### Database

* PostgreSQL

### Containerization

* Docker
* Docker Compose

### Web Server / Reverse Proxy

* Nginx

### Cloud

* AWS EC2
* AWS CloudWatch

### Infrastructure

* Terraform

### CI

* GitHub Actions

### Version Control

* Git
* GitHub

### Operating System

* Linux

### Authentication

* JWT-based authentication

---

## ✨ Features

### 🔐 Authentication

* Administrative login
* JWT-based authentication
* Protected administrative operations

### 📦 Inventory Management

* View inventory
* Add inventory items
* Delete inventory items
* Retrieve inventory through API endpoints

### 🗄️ Database

* PostgreSQL database
* Persistent Docker volume
* Database initialization through SQL configuration
* Application-to-database connectivity

### 🐳 Containerization

The application is organized into containerized services including:

```text
Application
PostgreSQL
Nginx
```

Docker Compose is used to manage the multi-container environment.

### 🌐 Nginx Reverse Proxy

Nginx acts as the reverse proxy and provides a centralized entry point to the application.

```text
Client
   │
   ▼
 Nginx
   │
   ▼
Node.js Application
   │
   ▼
PostgreSQL
```

### 🔄 Continuous Integration

GitHub Actions is used to automate the CI workflow.

The pipeline performs tasks including:

* Source-code checkout
* Node.js environment setup
* Dependency installation
* Docker image build
* Docker image verification

### ☁️ AWS Deployment

The application is deployed on an AWS EC2 instance running a Linux environment.

### 📊 Monitoring

AWS CloudWatch is used to monitor EC2 infrastructure.

A CPU utilization alarm is configured to help identify abnormal resource usage.

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── ...
│
├── nginx/
│   └── default.conf
│
├── terraform/
│   └── ...
│
├── Dockerfile
├── docker-compose.yml
├── init.sql
├── package.json
├── package-lock.json
├── app.js / server.js
├── .gitignore
└── README.md
```

> File names may vary slightly depending on the current project implementation.

---

## 🐳 Docker Architecture

The application uses Docker Compose to manage multiple services.

### Application Container

Runs the Node.js / Express application.

### PostgreSQL Container

Runs PostgreSQL and stores application data using a persistent Docker volume.

### Nginx Container

Acts as the reverse proxy and provides the external application entry point.

---

## 🗄️ PostgreSQL Persistence

PostgreSQL data is stored using a Docker volume.

```text
PostgreSQL Container
        │
        ▼
   Docker Volume
        │
        ▼
 Persistent Database Data
```

This prevents application data from being lost when the PostgreSQL container is recreated.

---

## 🔐 Environment Configuration

Sensitive configuration values should be stored using environment variables.

Example:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=inventorydb
DB_USER=postgres
DB_PASSWORD=********
```

**Never commit real passwords, API keys, AWS credentials, `.pem` files, or other secrets to GitHub.**

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/niranjan24git/inventory-order-management.git
```

### 2. Enter the project directory

```bash
cd inventory-order-management
```

### 3. Build and start the containers

```bash
docker compose up --build
```

### 4. Run in detached mode

```bash
docker compose up -d --build
```

### 5. Check running containers

```bash
docker compose ps
```

### 6. View application logs

```bash
docker compose logs app
```

### 7. Stop the application

```bash
docker compose down
```

---

## 🔍 Application Health Check

The backend provides a health endpoint.

```text
GET /health
```

Example response:

```json
{
  "status": "UP",
  "database_connected": true
}
```

This endpoint can be used to verify application and database connectivity.

---

## 📡 Inventory API

Example inventory endpoint:

```text
GET /api/v1/inventory
```

The endpoint returns inventory information from PostgreSQL through the Node.js backend.

Example:

```json
[
  {
    "name": "Premium Wireless Headphones",
    "stock": 25
  },
  {
    "name": "Mechanical Ergonomic Keyboard",
    "stock": 18
  }
]
```

---

## 🔄 GitHub Actions CI

The repository contains a GitHub Actions workflow under:

```text
.github/workflows/ci-cd.yml
```

The CI workflow performs:

```text
GitHub Push
     │
     ▼
Checkout Code
     │
     ▼
Setup Node.js
     │
     ▼
Install Dependencies
     │
     ▼
Build Docker Image
     │
     ▼
Verify Image
```

This provides automated validation of the project whenever changes are pushed to the repository.

---

## ☁️ AWS Deployment

The application was deployed to an **AWS EC2 instance** running Linux.

High-level deployment architecture:

```text
Internet
   │
   ▼
AWS EC2
   │
   ▼
Nginx
   │
   ▼
Node.js Container
   │
   ▼
PostgreSQL Container
```

AWS Security Groups are used to control network access to the EC2 instance.

---

## 🏗️ Infrastructure Management

Terraform was used as part of the AWS infrastructure management workflow.

Benefits include:

* Infrastructure configuration as code
* Repeatable configuration
* Version-controlled infrastructure
* Reduced manual configuration
* Easier infrastructure changes

---

## 📊 AWS CloudWatch Monitoring

AWS CloudWatch is used for EC2 infrastructure monitoring.

The project includes monitoring of EC2 metrics such as:

* CPU utilization
* EBS activity
* Instance performance metrics

A CPU utilization alarm was configured to help identify high resource utilization.

---

## 🔒 Security Considerations

The project follows basic security practices including:

* Environment variables for sensitive configuration
* `.gitignore` for sensitive/local files
* Authentication for administrative access
* AWS Security Groups for network control
* No credentials committed to source control

**Never commit:**

```text
.env
*.pem
AWS access keys
Database passwords
API keys
Private credentials
```

---

## 📈 DevOps Practices Demonstrated

This project demonstrates practical experience with:

* Version control
* Git workflows
* Continuous Integration
* Docker containerization
* Docker Compose
* Linux administration
* Reverse proxy configuration
* Database persistence
* Cloud deployment
* Infrastructure as Code
* AWS EC2
* Cloud monitoring
* Infrastructure alarms
* Application health checks

---

## 🎯 Project Objectives

The primary objectives were to:

1. Containerize an application and database.
2. Create a reproducible local development environment.
3. Implement Git-based source control.
4. Automate CI using GitHub Actions.
5. Deploy the application to AWS EC2.
6. Configure Nginx as a reverse proxy.
7. Maintain persistent PostgreSQL data.
8. Manage AWS infrastructure using Terraform.
9. Monitor cloud infrastructure using CloudWatch.
10. Understand the complete DevOps lifecycle.

---

## 📚 Key Learnings

Through this project, I gained hands-on experience with:

* Docker networking and container management
* Docker Compose service orchestration
* PostgreSQL persistence
* Nginx reverse proxy configuration
* Linux server administration
* Git and GitHub workflows
* GitHub Actions CI automation
* AWS EC2 deployment
* Terraform-based infrastructure management
* CloudWatch monitoring
* Application health monitoring
* Environment-based configuration
* Troubleshooting production-style deployments

---

## 🔮 Future Improvements

Potential future enhancements include:

* Automated deployment from GitHub Actions to AWS
* Docker image registry integration
* HTTPS using SSL/TLS
* AWS Load Balancer
* Auto Scaling
* Blue-green or rolling deployments
* Kubernetes orchestration
* Prometheus and Grafana monitoring
* Centralized log management
* Automated backup strategy

---

## 👨‍💻 Author

**Niranjan**

Cloud & DevOps Engineering Enthusiast

### Technologies

`AWS` `Docker` `Terraform` `GitHub Actions` `Linux` `PostgreSQL` `Node.js` `Nginx` `Git` `CI/CD`

---

## 📜 License

This project is intended for educational and portfolio purposes.
