# 💰 Smart Expense Tracker

A cloud-based expense management application designed to help users efficiently track, manage, and analyze their daily expenses. The platform provides expense monitoring, financial insights, analytics, and secure cloud storage through AWS RDS.

## 🚀 Features

💵 Add, Edit, and Delete Expenses  
📊 Interactive Dashboard with Expense Summary  
📜 Expense History with Search and Filters  
📈 Expense Analytics and Category Insights  
☁️ AWS RDS Cloud Database Integration  
🔄 Real-Time CRUD Operations  
📱 Responsive and User-Friendly Interface  
🔒 Secure Data Storage and Management  

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- REST APIs
- HTTP Server

### Database
- MySQL
- AWS RDS

### Development Tools
- VS Code
- Git & GitHub
- DBeaver

## 📂 Project Structure

```text
smart-expense-tracker/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── createDB.js
│   ├── createTables.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── index.html
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/AakritiTiwari09/smart-expense-tracker.git
```

### Navigate to Project

```bash
cd smart-expense-tracker
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 📊 Modules

### Dashboard
Displays total expenses, total transactions, and top spending category with quick financial insights.

### Add Expense
Allows users to add expenses with amount, category, description, and date.

### Expense History
View, search, filter, edit, and delete expense records.

### Analytics
Provides visual charts and category-wise spending analysis for better financial understanding.

### Cloud Database
Stores and retrieves expense data securely using AWS RDS MySQL.

## ☁️ AWS Integration

### Amazon RDS
- Cloud-hosted MySQL database
- Secure remote connectivity
- Persistent data storage
- Real-time database operations

## 🌟 Future Enhancements

- Budget Management System
- Budget Alerts & Notifications
- JWT Authentication
- User-Specific Expense Tracking
- CSV/PDF Export
- AWS S3 Bill Upload
- AI-Based Spending Insights
- AI Financial Assistant

## 👨‍💻 Author

**Aakriti Tiwari**

GitHub: https://github.com/AakritiTiwari09

## 📜 License

This project is developed for educational and learning purposes.
