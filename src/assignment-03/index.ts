import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.ts';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({message: "Assignment 3: CORS + MySQL API",method:"GET"});
});


app.get('/users',async(req,res)=>{
    try {
        const [rows,fields] = await pool.query('SELECT * FROM users');
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error('DB Error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/users',async(req,res)=>{
    try {
        const {name,email} = req.body;
        const [result] = await pool.query('INSERT INTO users (name,email) VALUES (?,?)',[name,email]);
        res.status(201).json({message: 'User created successfully',result});
    } catch (error) {
        console.error('DB Error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});