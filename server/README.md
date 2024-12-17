# GradLink Deployment Guide

This guide will walk you through the steps to deploy the GradLink application using Docker.

---

## Prerequisites
Before deploying GradLink, ensure you have the following installed on your system:

1. **Docker Desktop**
   - Download and install Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/).

---

## Deployment Steps

### 1. Load Docker Images
The GradLink application consists of the following Docker images:
- `gradlink-server.tar`
- `gradlink-client.tar`
- `gradlink-node.tar`
- `gradlink-nginx.tar`
- `gradlink-mongodb.tar`

To load these images into Docker, use the `docker load` command:

```bash
# Load the server image
docker load < gradlink-server.tar

# Load the client image
docker load < gradlink-client.tar

# Load the node image
docker load < gradlink-node.tar

# Load the nginx image
docker load < gradlink-nginx.tar

# Load the MongoDB image
docker load < gradlink-mongodb.tar
```

Ensure that all the images are successfully loaded.

---

### 2. Start the Application
Once the Docker images are loaded, start the GradLink application using `docker-compose`:

1. Place the `docker-compose.yml` file in the root directory.

2. Run the following command in the directory containing `docker-compose.yml`:

   ```bash
   docker-compose up -d
   ```

   This command will:
   - Start the GradLink client, server, MongoDB, and other necessary services.
   - Automatically run the containers in detached mode (`-d`).

---

### 3. Access the Application
Once the containers are running, you can access the GradLink application in your browser:

1. Determine your machine's IP address.
   - On Windows or macOS with Docker Desktop, you can usually access the application at `http://localhost`.
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