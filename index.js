import express from 'express';
import bodyparser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false, // required for Render
  },
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('DB connection error:', err.stack));

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post("/submit", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    await db.query(
      'INSERT INTO portfoliodata (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    res.status(201).redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
