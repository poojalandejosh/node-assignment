# Assignment 03 — CORS + MySQL Integration

## Problem Statement

Add CORS to your Node.js app and integrate MySQL.

## Solution

An Express REST API that:

- Enables **CORS** for cross-origin requests
- Connects to **MySQL** using `mysql2`
- Fetches and creates users in a `users` table

## Tech Stack

| Package | Purpose |
|---------|---------|
| `express` | Web server and API routes |
| `cors` | Allow requests from other origins (browser/frontend) |
| `mysql2` | MySQL database connection |
| `dotenv` | Load config from `.env` file |

## Project Structure
