const express = require("express");
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
