import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World", method: "GET" });
  });

app.post('/',(req,res)=>{
    res.status(201).json({message:"Hello World",method:"POST"});
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});