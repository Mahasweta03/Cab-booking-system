
# 🚖 Cab Booking System  
A full‑stack web application for seamless cab booking built using **ASP.NET Core**, **Entity Framework Core**, and **Microsoft SQL Server (MSSQL)**.  
This system allows users to book rides, manage ride history, and enables admins to handle drivers, bookings, and system operations efficiently.

---

## 📌 Table of Contents
- features
- screenshots
- tech-stack
- project-structure 
- database-design
- setup-instructions
- ef-core-migrations
- how-to-run
- api-endpoints-optional
- environment-variables
- contribution
- license
- author


## ✨ Features
✔ User registration & login  
✔ Book a cab with pickup & drop  
✔ View ride history  
✔ Driver management  
✔ Admin panel with CRUD operations  
✔ Real‑time validations  
✔ Clean UI with Razor/MVC  
✔ Database-driven using EF Core  

## 📸 Screenshots

### 🖥 Landing Page
![Landing Page](Frontend_Snippets/HeroPage.png)
`Frontend_Snippets/LandingPage.png`
`Frontend_Snippets/LandingPagep2.png`

### 🚖 Booking Page
`Frontend_Snippets/CabBook.png`

### 👤 User Registration
`Frontend_Snippets/UserRegistration.png`

### 🚕 Driver Registration
`Frontend_Snippets/DriverRegister.png`



## 🛠 Tech Stack  

### **Frontend**
- HTML5  
- CSS3  
- JavaScript  
- Razor Pages / MVC  

### **Backend**
- ASP.NET Core  
- C#, LINQ  
- Entity Framework Core  

### **Database**
- Microsoft SQL Server  

### **Tools**
- Visual Studio Code
- Visual Studio
- Git & GitHub  
- EF Core  

---

## 📂 Project Structure
Cab-booking-system/
│
├── Controllers/
├── Models/
├── Views/
├── Migrations/
├── Backend_Snippets/
├── Frontend_Snippets/
├── images/
├── wwwroot/
├── appsettings.json
├── Program.cs
└── README.md

---

## 🗄 Database Design

### **Entities**
- Home
- User  
- Driver  
- Ride Booking
- Payment
- Rating


## ⚙️ Setup Instructions  

### ✔ 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Cab-booking-system.git
cd Cab-booking-system
```
### ✔ 2. Restore dependencies
```bash
dotnet restore
```
### ✔ 3. Configure connection string
Open appsettings.json:
```bash
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=CabBookingDB;Trusted_Connection=True;"
}
```
### ✔ 4. Apply database migrations
```bash
dotnet ef database update
```
### 🧪 EF Core Migrations
To add new migrations:
```bash
dotnet ef migrations add MigrationName
```
To apply migrations:
```bash
dotnet ef database update
```

### 🚀 How to Run
```bash
dotnet run
```
Then open your browser:
``` https://localhost:5001``` or ``` http://localhost:5000 ```

### 🔐 Environment Variables
Optional .env or secret storage:
```
DB_USER=yourUsername
DB_PASSWORD=yourPassword
DB_NAME=CabBookingDB
```

### 🤝 Contribution
Contributions, issues, and feature requests are welcome!
Feel free to fork the repository and submit pull requests.

### 📜 License
This project is licensed under the MIT License.

### 👩‍💻 Author
Mahasweta Saha
