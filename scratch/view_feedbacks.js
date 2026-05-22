const { Client } = require('pg');

const connectionString = 'postgresql://postgres.dyvzcshgovhdyszhzuch:StrongPass%40123%21%40%23@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    
    const res = await client.query('SELECT "userName", feedback FROM public."interview-feedback" LIMIT 10;');
    for (let row of res.rows) {
      console.log("Candidate:", row.userName);
      console.log("Feedback JSON:", typeof row.feedback === 'string' ? row.feedback.substring(0, 300) : JSON.stringify(row.feedback).substring(0, 300));
      console.log("-----------------------------------------");
    }
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
