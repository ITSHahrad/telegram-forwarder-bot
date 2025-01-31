export default {
  async fetch(request, env) {
    console.log("📡 Bot received a request...");

    if (request.method !== "POST") {
      console.log("⛔ Invalid request method:", request.method);
      return new Response("Method not allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
      console.log("📩 Received Telegram update:", JSON.stringify(body, null, 2));
    } catch (error) {
      console.error("❌ Error parsing request JSON:", error);
      return new Response("Invalid JSON", { status: 400 });
    }

    const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const TARGET_USER_ID = env.TARGET_USER_ID;
    const TELEGRAM_API_URL = env.TELEGRAM_API_URL;

    if (!body.message) {
      console.log("ℹ️ No message found in update.");
      return new Response("گوربایی ارسال نشده است ☁🐈", { status: 200 });
    }

    if (body.message.text && body.message.text.includes('/start')) {
      console.log('ℹ️ Start command found!');
      return new Response('لطفا عکس یا ویدیو گوربای خود را ارسال کنید ☁🐈', { status: 200 });
    }

    const message = body.message;
    const chatId = message.chat.id;
    const senderUsername = message.from.username ? `@${message.from.username}` : `User ID: ${message.from.id}`;
    const caption = message.caption ? message.caption : "No caption";

    if (message.photo) {
      console.log("📷 Photo received from:", senderUsername);
      const fileId = message.photo[message.photo.length - 1].file_id;
      await forwardMedia(TELEGRAM_API_URL, BOT_TOKEN, fileId, TARGET_USER_ID, "photo", senderUsername, caption);
    } else if (message.video) {
      console.log("🎥 Video received from:", senderUsername);
      const fileId = message.video.file_id;
      await forwardMedia(TELEGRAM_API_URL, BOT_TOKEN, fileId, TARGET_USER_ID, "video", senderUsername, caption);
    } else {
      console.log("❌ Invalid message type, rejecting.");
      await sendTextMessage(TELEGRAM_API_URL, BOT_TOKEN, chatId, "لطفا فقط عکس و ویدیو از گوربای خود ارسال کنید ☁🐈");
    }

    return new Response("OK", { status: 200 });
  },
};

async function forwardMedia(apiUrl, token, fileId, userId, type, sender, caption) {
  const messageCaption = `📩 Sent by: ${sender}\n📝 Caption: ${caption}`;
  console.log(`➡️ Forwarding ${type} to target user: ${userId}`);

  const mediaKey = type === "photo" ? "photo" : "video"; // Correct key names

  await fetch(`${apiUrl}/bot${token}/send${capitalize(type)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: userId,
      [mediaKey]: fileId, // Correct property name
      caption: messageCaption,
      parse_mode: "Markdown",
    }),
  }).then(response => response.json())
    .then(data => console.log("✅ Telegram API Response:", data))
    .catch(error => console.error("❌ Error sending media:", error));
}

async function sendTextMessage(apiUrl, token, chatId, text) {
  console.log("📤 Sending rejection message...");
  await fetch(`${apiUrl}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  }).then(response => response.json())
    .then(data => console.log("✅ Message Sent Response:", data))
    .catch(error => console.error("❌ Error sending message:", error));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
