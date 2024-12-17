# GradLink Deployment Guide

This guide will walk you through the steps to deploy the GradLink application using Docker.

---

## Prerequisites
Before deploying GradLink, ensure you have the following installed on your system:

1. **Docker Desktop**
   - Download and install Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/).

2. **GradLink Deployment Folder**
   - If you don't have the "gradlink-deployment.zip" zipped folder, you may download it from here [Google Drive](https://drive.google.com/drive/folders/1AC5PKbfBR8CaDhb5qKQhA4D9s7rsEGxj?usp=sharing).
   - Unzip the file

---

## Deployment Steps

### 1. Start the Application

1. Ensure Docker Desktop is open

2. Run the file "deploy.bat" from the directory.

---

### 2. Access the Application
Once the containers are running, you can access the GradLink application in your browser:

1. Determine your machine's IP address.
   - On Windows or macOS with Docker Desktop, you can usually access the application at `http://<YOUR-IP-ADDRESS>`.
   - On a remote server, use the server's public IP address.

2. Open your browser and navigate to:
   ```
   http://<YOUR_IP_ADDRESS>
   ```
   The application runs on port `80`.

For example:
- If you are running locally: `http://localhost`
- If the IP address of your server is `192.168.1.100`: `http://192.168.1.100`

---

## Notes
- Ensure that the `.env` file is correctly configured before running `docker-compose up -d`. This file contains necessary environment variables for the application.
- If you encounter any issues, verify that Docker is running and the images are correctly loaded.
- To stop the application, use:
  ```bash
  docker-compose down
  ```

---

Your GradLink application is now deployed and ready to use!