# ticket-management
ticket-management/
├── services/
│ ├── user/
│ │ ├── cmd/ # entry point (main.go)
│ │ ├── handler/ # HTTP handler
│ │ ├── service/ # Business logic
│ │ ├── model/ # DTOs / Entities
│ │ ├── repository/ # DB access
│ │ ├── config/ # env, config file
│ │ └── Dockerfile
│ ├── booking/
│ ├── seat/
│ ├── payment/
│ └── notification/
├── shared/ # Code dùng chung giữa các services
│ ├── logger/
│ ├── auth/
│ ├── utils/
│ └── go.mod # Module riêng (nếu dùng)
├── deployments/ # Kubernetes manifests / Terraform
│ ├── dev/
│ ├── staging/
│ └── prod/
├── docker-compose.yml # Chạy local nhiều service cùng lúc
├── Makefile # Build/run nhanh từng service
├── .env # Biến môi trường dùng chung
├── README.md
└── go.work # Kết nối đa module Go (Go 1.18+)
