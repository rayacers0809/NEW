export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  const fields = Object.keys(data).map((key) => ({
    name: key,
    value: data[key] || "미입력",
    inline: false
  }));

  const payload = {
    content: "📌 **새로운 DOGE 뉴비도우미 지원서 도착!**",
    embeds: [
      {
        title: "🐾 DOGE 뉴비도우미 지원서",
        color: 0x8e2de2,
        fields,
        footer: { text: "DOGE 서버 지원 시스템" },
        timestamp: new Date()
      }
    ]
  };

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Discord error: ${response.status} ${text}`);
    }

    res.status(200).json({ ok: true, message: "Webhook 전송 성공 ✅" });
  } catch (err) {
    console.error("❌ Webhook 전송 실패:", err.message);
    res.status(500).json({ error: "Webhook 전송 실패", details: err.message });
  }
}
