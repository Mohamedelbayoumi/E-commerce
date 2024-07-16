# E-Commerce Backend Application


## Overview

This repository contains the backend code for E-commerce application using node.js,express.js, mysql and sequelize. It is server side rendering application that resulted in improved performance and scalability of the application

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Technologies](#Technologies)
- [Prerequisites](#Prerequisites)
- [How_to_install](#How_to_install)

## Features

- **User Authentication and authorization:** Secure user authentication with cookies and session.
- **Product Management:** CRUD operations for managing products.
- **Order Processing:** Order creation with downloading invoices.
- **Shopping Cart:** Persistent shopping cart for users.
- **Template engines:** Integration with embeded javascript (ejs).
- **Cross site request forgery Token:** adding security using csrf-sync package.
- **Sending emails:** sending emails to reset password using mailgun and nodemailer npm package
- **Relational Database:** making relations in database between users,orders,carts and products using sequelize
- **Validation :** validating inputs using express-validator
- **Model-View-Controller :** This appliction built in MVC design pattern

## Technologies

- Node.js
- Express.js
- Mysql
- Sequelize
- Cookies & Session
- Multer
- nodemon
- connect-flash
- csrf-sync
- ejs
- nodemailer
- pdfkit
- bcryptjs
- express-validator
- MVC design pattern

### Prerequisites

- mysql installed and running.
- [Node.js](https://nodejs.org/) installed.

### How_to_install

- Clone the repository:

   ```bash
   git clone https://github.com/your-username/E-commerce.git
   cd E-commerce
   npm install
   node app.js
