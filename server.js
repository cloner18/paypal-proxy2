const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

app.all("/proxy/*", async (req, res) => {
  const target = req.url.replace("/proxy/", "");
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(target).host,
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });
    const data = await response.text();
    res.status(response.status);
    res.set("Content-Type", response.headers.get("content-type"));
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
