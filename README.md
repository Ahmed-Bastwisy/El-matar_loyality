Loyalty Points Transfer System
==============================

This project is a simple Node.js-based web application that allows users to transfer loyalty points to each other. Below are the instructions to set up and run the server and use the API.

Prerequisites
-------------

*   Node.js 
    
*   MongoDB
    
*   Postman (for testing the API)
    

Installation
------------

1.  git clone https://github.com/Ahmed-Bastwisy/El-matar_loyality.git
    
2.  npm install -f
    
3.  **Set up environment variables**:
    
    *   .env file is already exist to keep monogo connection url
        
4.  node server.js The server will start on http://localhost:8500.
    

Postman API Testing
-------------------

You can test the API using Postman. Follow these steps:

1.  **Download the Postman collection**:
    
    *   the Postman collection for this project [here](./elmatar-loyality.postman_collection.json).
        
2.  Example:jsonCopy code{ "name": "John Doe", "email": "john@example.com", "password": "password123"}
    
    *   Start by making a POST request to the /api/user/register endpoint to create a new user.
        
    *   You’ll need to provide a name, email, and password.
        
3.  **Login to Get Token**:
    
    *   After the user is created, go to the /api/user/login request.
        
    *   You will need to provide the email and password.
        
    *   This will return a JWT token, which you will use for other API requests.
        
4.  **Set Token in Postman**:
    
    *   Copy the token from the login response.
        
    *   In Postman, go to the Authorization tab for any subsequent request.
        
    *   Select Bearer Token from the type dropdown and paste the token.
        
5.  **Endpoints Available in Postman Collection**:
    
    *   /api/user/register: Register a new user.
        
    *   /api/user/login: Log in and get the authentication token.
        
    *   /api/user/wallet: View user’s wallet and points.

    *   /api/user/transactions: View user’s transactions.

    *   /api/transaction: List all transactions.
        
    *   /api/transaction/transfer: Create a new points transfer.
        
    *   /api/transaction/transfer/process: process a pending points transfer by add action "confirm or reject".
        
    *   /api/transaction/expired: Check and handle expired transactions.

    *   /api/wallet: List all wallets.

    *   /api/wallet/:id: get wallet details.
        

Common Issues
-------------

*   **MongoDB Connection Error**: Make sure MongoDB is running and the connection string in the .env file is correct.
    
*   **Invalid Token**: Ensure that you have copied the token correctly in Postman, and it hasn't expired.
    

Conclusion
----------

Follow the steps above to set up the server and use Postman for testing the API endpoints. You can extend the functionality as needed or improve the application by adding more features.