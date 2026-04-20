
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log("Using API Key:", apiKey ? "FOUND" : "MISSING");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello and return a JSON object with a 'message' key." }
        ],
        response_format: { type: "json_object" },
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testOpenRouter();
