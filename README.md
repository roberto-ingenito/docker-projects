[How to configure github-actions self-hosted](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners#adding-a-self-hosted-runner-to-a-repository)

# How to set statical ip on Ubuntu Server
```
sudo nano /etc/netplan/50-cloud-init.yaml
```

Incolla
```
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.20/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
```

Poi applica le modifiche con 
```
sudo netplan apply
```