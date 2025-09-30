
# GitHub Actions Self-Hosted Runner on Ubuntu EC2

## 📋 Prerequisites  
- Ubuntu EC2 instance (recommended: Ubuntu 20.04 or 22.04)  
- GitHub repository (public or private)  
- Admin access to the repository   
- GitHub Personal Access Token or registration token  

---  

## 🛠️ Step 1: Install Dependencies  

### Update and install required packages:  
sudo apt update  
sudo apt install -y curl unzip ca-certificates gnupg software-properties-common  

### Install Docker:  
curl -fsSL https://get.docker.com -o get-docker.sh  
sudo sh get-docker.sh  
sudo usermod -aG docker $USER  
newgrp docker  

### Install Node.js:  
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -  
sudo apt install -y nodejs  

### Install unzip:   
sudo apt install -y unzip  

---  

## 🏗️ Step 2: Download and Configure GitHub Runner  

### Create a directory and download the runner:  
mkdir ~/actions-runner && cd ~/actions-runner  
curl -o actions-runner-linux-x64-2.308.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.308.0/actions-runner-linux-x64-2.308.0.tar.gz  
tar xzf actions-runner-linux-x64-2.308.0.tar.gz  

### Register the runner:  
./config.sh --url https://github.com/<your-org-or-username>/<repo-name> --token <your-token>  

---

## 🔄 Step 3: Create a systemd Service  

### Create the service file:  
sudo nano /etc/systemd/system/github-runner.service  

Paste:  
[Unit]  
Description=GitHub Actions Runner  
After=network.target  

[Service]  
User=ubuntu  
WorkingDirectory=/home/ubuntu/actions-runner  
ExecStart=/home/ubuntu/actions-runner/run.sh  
Restart=always   
RestartSec=10  
KillMode=process  

[Install]  
WantedBy=multi-user.target  

### Enable and start the service:  
sudo systemctl daemon-reexec  
sudo systemctl daemon-reload  
sudo systemctl enable github-runner  
sudo systemctl start github-runner  

---

## ☸️ Step 4: Integrate with Amazon EKS  
```
### Install AWS CLI:  
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  
unzip awscliv2.zip  
sudo ./aws/install  
```  


### Install kubectl:  
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"  
chmod +x kubectl
sudo mv kubectl /usr/local/bin/  

### Update kubeconfig for EKS:
aws eks update-kubeconfig --region <your-region> --name <your-cluster-name>
```  
---


## ✅ Step 5: Verify Runner  

### Check status:  
systemctl status github-runner  
 
### View logs:  
journalctl -u github-runner -f  
EOF
