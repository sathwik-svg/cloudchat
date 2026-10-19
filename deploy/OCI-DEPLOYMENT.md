# CloudChat — Ubuntu / OCI Deployment

## Current deployment model

- Node.js + Express + Socket.IO
- systemd manages the application process
- The application listens on 127.0.0.1:3000 in the service configuration
- A reverse proxy should handle public HTTP/HTTPS traffic
- GitHub Actions runs automated tests

## Prerequisites

- An eligible Ubuntu VM
- Node.js 22 and npm installed
- SSH access to the VM
- Git access to this repository

## Install the application

Review the VM, firewall and account configuration before deploying.
Do not expose TCP/3000 publicly.

Create the service account and application directory:

    sudo useradd --system --home /opt/cloudchat --shell /usr/sbin/nologin cloudchat
    sudo mkdir -p /opt/cloudchat
    sudo chown cloudchat:cloudchat /opt/cloudchat

Clone or copy the repository into /opt/cloudchat, then install production
dependencies as the service user:

    sudo -u cloudchat git clone https://github.com/sathwik-svg/cloudchat.git /opt/cloudchat
    sudo -u cloudchat npm ci --omit=dev --prefix /opt/cloudchat

Install the service file:

    sudo install -m 0644 /opt/cloudchat/deploy/cloudchat.service /etc/systemd/system/cloudchat.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now cloudchat

Check service status and health:

    sudo systemctl status cloudchat --no-pager
    curl --fail http://127.0.0.1:3000/api/health

## Security checklist

- Restrict SSH ingress to a trusted source IP where practical.
- Allow public HTTP/HTTPS only when a reverse proxy is configured.
- Do not expose TCP/3000 to the public internet.
- Configure HTTPS before sharing the app publicly.
- Never commit private keys, passwords or tokens.
- Back up any persistent data before upgrades.
- Review Oracle's current Always Free limits and billing information.

## Current limitations

Messages are stored in process memory and may disappear after a restart.
There is no user authentication or durable message database yet.
A single VM does not provide high availability.
