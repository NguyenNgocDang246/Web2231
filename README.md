# E-commerce clothing sales website
This is an e-commerce website designed to support online clothing stores. It offers a user-friendly platform for showcasing and selling apparel efficiently.

# Setup Instructions
### 1. Clone the Repository
Clone this repository:
```bash
git clone <repository-url>
cd <repository-directory>
```
### 2. Install Dependencies
Install the required packages:
```bash
npm install
```
### 3. Config API Key
1. Create a file named .env in the project root directory
2. Add the following content to .env:
```bash
PORT="your-server-port"
DB_URI="your-database-uri"
MONGODB_URI_SESSION="your-mongo-uri-for-session"
SS_KEY="your-secret-key-for-JWT"
GG_CLIENT_ID="your-google-client-id-for-sign-in-with-google"
GG_CLIENT_SECRET="your-google-secret"
```
# Run Application
```bash
npm start
```