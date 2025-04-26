const app = require("./app");
const { connectDB } = require("./db/databaseConnection");

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||3000 , () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);  
})