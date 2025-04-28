🎥 Suuno API — Video Sharing Backend

Suuno is a Node.js and Express.js backend project for a video-sharing platform, inspired by YouTube.
It provides APIs for user authentication, channel management, subscriptions, video uploads, and more.
Tested using Postman.

🚀 Features
User authentication (Register, Login, Logout)
User profiles with:
Full Name, Username, Avatar, Cover Image
Subscribers and Subscriptions count
Subscribe / Unsubscribe to channels
Upload videos with title, description, thumbnail
Upload videos, avatar images, and cover images using Cloudinary
Like / Dislike videos
Comment on videos
Secure password hashing
JWT Authentication with refresh tokens
Aggregation pipelines for optimized queries
Clean error handling

🛠️ Tech Stack
Backend Framework: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JWT tokens, Cookies
File Uploads: Multer
Password Security: bcrypt
Other: express-async-handler, dotenv

📂 Project Structure
/server
  /controllers   --> Business logic (users, videos, auth, comments, subscriptions)
  /db            --> DB configration
  /models        --> Mongoose Schemas
  /routes        --> Express API routes
  /middlewares   --> Authentication, Error handling
  /uploads       --> Stored video and image files
  /utils         --> Helper functions
  /views         --> Frontend views
app.js           --> Main app setup
index.js        --> Server startup
.gitignore
package.lock.json
package.json

☁️ Cloudinary Integration
All uploaded files (videos, avatars, cover images) are stored securely on Cloudinary.
The server uploads files directly to Cloudinary and saves the resulting URL in MongoDB.

📬 API Endpoints Overview

Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	Login and get token
POST	/logout	Logout user
GET	/profile	Get user channel profile
POST	/change-password	Change the password
POST	/update-user	Update user details
POST	/change-coverimage	Update user cover image
POST	/change-avatar	Update user avatar
GET   /history  Get user history

🔥 Getting Started
1. Clone the repository:
git clone https://github.com/SachidanandSharma2162/youtube_backend.git
cd suuno-backend
2. Install dependencies:
npm install
3. Create a .env file:
PORT=3000
MONGO_URI=your-mongodb-uri
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your-access-token
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
4. Start the server:
npx nodemon or nodemon app.js
5. Test APIs using Postman:
Import the provided Postman Collection (optional).
Set Authorization header with Bearer Token where required.
For file uploads, use form-data and set the correct key (e.g., file).

🧩 Future Enhancements
Video recommendation algorithm
User notifications system
Video playlists
Admin panel for managing users and videos
Rate limiting and security hardening (Helmet, CORS, etc.)

🙌 Acknowledgments
This project was built to simulate a real-world backend service similar to YouTube, using modern development practices.
