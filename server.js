const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { createClient } = require("@supabase/supabase-js");

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/", (req, res) => {
  res.send("AI Reel Manager Backend Running 🚀");
});

app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/instagram-test", async (req, res) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
app.get("/upload-reel", async (req, res) => {
  try {
    const { video_url, caption } = req.query;

    if (!video_url || !caption) {
      return res.status(400).json({
        success: false,
        message: "video_url and caption required"
      });
    }

    // STEP 1: Create media container
    const createResponse = await fetch(
      `https://graph.facebook.com/v23.0/${process.env.INSTAGRAM_BUSINESS_ID}/media?` +
      new URLSearchParams({
        media_type: "REELS",
        video_url: video_url,
        caption: caption,
        access_token: process.env.EAAdnftas5k4BRi2BDKtoYNUxFR336drWUTueMr1YzAUt6ZCm4Jy0el5YGkyG8kJdI0zT7GC7WPNCSrK28bzwGbfQrKpbjIPObnm7f5TINaeGKljaqws4bA8AZAoQ7ZCytu4mogoU10cueZAHaZAy5Q4QvwZACZBclaARtyEjnLwBel7rZA83zgyg3qXxZACje
      }),
      { method: "POST" }
    );

    const createData = await createResponse.json();

    if (!createData.id) {
      return res.status(500).json({
        success: false,
        step: "container_create_failed",
        error: createData
      });
    }

    const creationId = createData.id;

    // STEP 2: Publish reel
    const publishResponse = await fetch(
      `https://graph.facebook.com/v23.0/${process.env.INSTAGRAM_BUSINESS_ID}/media_publish?` +
      new URLSearchParams({
        creation_id: creationId,
        access_token: process.env.EAAdnftas5k4BRi2BDKtoYNUxFR336drWUTueMr1YzAUt6ZCm4Jy0el5YGkyG8kJdI0zT7GC7WPNCSrK28bzwGbfQrKpbjIPObnm7f5TINaeGKljaqws4bA8AZAoQ7ZCytu4mogoU10cueZAHaZAy5Q4QvwZACZBclaARtyEjnLwBel7rZA83zgyg3qXxZACje
      }),
      { method: "POST" }
    );

    const publishData = await publishResponse.json();

    return res.json({
      success: true,
      message: "Reel uploaded successfully 🚀",
      creation_id: creationId,
      publish_data: publishData
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
