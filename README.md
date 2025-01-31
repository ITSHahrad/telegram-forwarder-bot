# Telegram Media Forwarding Bot (Cloudflare Workers)

This is a **Telegram bot** built with **Cloudflare Workers** and **Node.js** that allows users to upload photos and videos. The bot forwards the received media to a specified target user while rejecting non-media messages.

## Features
- ✅ **Handles photos & videos only** (rejects other message types)
- ✅ **Forwards media** to a specific Telegram user with a sender mention
- ✅ **Supports captions** and attaches them to forwarded media
- ✅ **Runs on Cloudflare Workers** for serverless deployment
- ✅ **Logs received messages & bot events** for debugging

## Technologies Used
- **Cloudflare Workers** (serverless execution)
- **Telegram Bot API**
- **Node.js (ES Modules)**
- **Wrangler** (for deployment)
- **Environment Variables** (for security)

## Installation & Deployment

### **1️⃣ Set Up a Telegram Bot**
1. Open Telegram and start a chat with [BotFather](https://t.me/BotFather).
2. Use `/newbot` to create a new bot and get your **BOT_TOKEN**.
3. Save the **bot token** for later.

### **2️⃣ Clone This Repository**
```sh
git clone https://github.com/your-username/telegram-bot-cloudflare.git
cd telegram-bot-cloudflare
```

### **3️⃣ Configure Environment Variables**
Rename `.env.example` to `.env` and fill in your bot credentials:
```ini
TELEGRAM_BOT_TOKEN=your-bot-token
TARGET_USER_ID=your-telegram-user-id
TELEGRAM_API_URL=https://api.telegram.org
```

### **4️⃣ Install Wrangler & Deploy**
1. Install Cloudflare Wrangler CLI:
   ```sh
   npm install -g wrangler
   ```
2. Authenticate with Cloudflare:
   ```sh
   wrangler login
   ```
3. Deploy the worker:
   ```sh
   wrangler publish
   ```
4. Set the Telegram webhook:
   ```sh
   curl -X POST "https://api.telegram.org/botYOUR_TELEGRAM_BOT_TOKEN/setWebhook?url=YOUR_WORKER_URL"
   ```

## Usage
- **Send a photo or video** to the bot → It forwards it to the target user.
- **Send anything else** → The bot rejects it with a message.
- **Use `/start` command** → The bot sends a greeting message.

## Debugging
View real-time logs with:
```sh
wrangler tail
```
If the bot is not responding, check your webhook:
```sh
curl -X GET "https://api.telegram.org/botYOUR_TELEGRAM_BOT_TOKEN/getWebhookInfo"
```

## License
This project is open-source under the **MIT License**.