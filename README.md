#  NestJS Real-Time Chat with WebSockets & Notifications Microservice
A scalable real-time chat application built with NestJS, Socket.io, and a decoupled notifications microservice using RabbitMQ/Kafka and Redis for queue management.
## 🧩 Project Structure
```
src/
├── chat/                     
│   ├── entities/
│   │   ├── message.entity.ts
│   │   └── room.entity.ts
│   ├── gateways/             
│   │   ├── chat.gateway.ts     
│   │   └── chat.gateway.spec.ts
│   ├── services/              
│   │   ├── chat.service.ts
│   │   └── chat.service.spec.ts
│   ├── dtos/                  
│   │   ├── create-message.dto.ts
│   │   └── join-room.dto.ts
│   ├── controllers/         
│   │   └── chat.controller.ts
│   ├── interfaces/            
│   │   └── connected-user.interface.ts
│   └── chat.module.ts
│
├── notifications/              
│   ├── consumers/              
│   │   └── email.consumer.ts
│   ├── services/
│   │   ├── notifications.service.ts
│   │   └── notifications.service.spec.ts
│   ├── dtos/
│   │   └── create-notification.dto.ts
│   └── notifications.module.ts
│
├── common/                   
│   ├── constants/             
│   │   └── events.constants.ts
│   ├── decorators/           
│   │   └── ws-user.decorator.ts
│   ├── guards/            
│   │   └── ws-jwt.guard.ts
│   └── filters/             
│       └── ws-exceptions.filter.ts
│
├── app.module.ts              
└── main.ts                   
```
## ✨ Features
-Real-time messaging with WebSockets (Socket.io).
-JWT authentication for WebSocket connections.
-Room-based chats and private messaging.
-Microservice architecture for notifications (RabbitMQ/Kafka).
-Redis-backed queues (@nestjs/bull) for async email/SMS notifications.
-Modular and scalable codebase following NestJS best practices.
## 📦 Tech Stack
-Backend: NestJS, TypeORM, Socket.io
-Authentication: JWT, Passport.js
-Microservices: RabbitMQ/Kafka
-Queues: Redis + Bull
-Database: PostgreSQL/MySQL (or any TypeORM-supported DB)
-APIs: REST (optional) + WebSockets
🛠 Setup & Installation
### Prerequisites
-Node.js (v18+)
-PostgreSQL/MySQL
-Redis (for queues)
-RabbitMQ/Kafka (for notifications microservice)
### 1. Clone the Repository
´´´
git clone https://github.com/your-username/nestjs-chat.git  
cd nestjs-chat  
´´´
### 2. Install Dependencies
```
npm install
```
### 3. Run the Application
```
# Start the main API (WebSocket server)  
npm run start:dev  

# Start the Notifications Microservice (in another terminal)  
npm run start:notifications  
```
## 👤 Author

Mateus Gomes
[GitHub](https://github.com/mateusgomes6)
[Email](mateusgomesdc@hotmail.com)
