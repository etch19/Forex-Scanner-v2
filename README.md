# 📡 Forex BB+RSI Scanner v2

سكانر فوركس ذكي مع تيليغرام بوت كامل، لوحة تحكم ويب، وإشارات مسبقة وتأكيدية.

---

## ✨ المميزات

| الميزة | التفاصيل |
|--------|----------|
| 🟡 PRE Signal | تحذير مسبق قبل الإشارة بدقيقة |
| 🟢🔴 Confirm Signal | إشارة دخول مؤكدة |
| ▶️ /start /stop | تشغيل وإيقاف عبر تيليغرام |
| ⏱ /tf1 /tf5 | تغيير الإطار الزمني لحظياً |
| 🌐 Web Dashboard | لوحة تحكم ويب بسيطة |
| 🔄 كل دقيقة | GitHub Actions يشغّل السكان |

---

## 📩 شكل الرسائل

### تحذير مسبق (PRE)
```
⏳ تحضير — صعود محتمل
━━━━━━━━━━━━━━
🟡 EURUSD  |  دقيقة
⏰ 10:23
💰 السعر: 1.08542
━━━━━━━━━━━━━━
📌 انتظر تأكيد الدخول في الشمعة القادمة ↑
```

### إشارة دخول مؤكدة
```
🟢 إشارة دخول — صعود
━━━━━━━━━━━━━━
📈 EURUSD  |  دقيقة
⏰ 10:24
💰 السعر: 1.08531
━━━━━━━━━━━━━━
✅ ادخل الشمعة القادمة ⬆️ فوق
```

---

## 🚀 خطوات الرفع

### 1. ارفع على GitHub
```bash
git init && git add . && git commit -m "init"
# أنشئ repo على github.com ثم:
git remote add origin https://github.com/USERNAME/forex-scanner.git
git push -u origin main
```

### 2. انشر على Vercel
- اذهب لـ vercel.com → Add New Project → اختر الـ repo → Deploy

### 3. أضف Environment Variables في Vercel
```
TELEGRAM_TOKEN    = توكن البوت من @BotFather
TELEGRAM_CHAT_ID  = معرفك من @userinfobot
CRON_SECRET       = كلمة سر عشوائية
```

### 4. اربط Telegram Webhook
بعد النشر، افتح هذا الرابط في المتصفح (مرة واحدة فقط):
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR-PROJECT.vercel.app/api/bot
```

### 5. أضف GitHub Secrets
في repo → Settings → Secrets → Actions:
```
VERCEL_SCAN_URL = https://YOUR-PROJECT.vercel.app/api/scan
CRON_SECRET     = نفس كلمة السر
```

### 6. فعّل GitHub Actions
- اذهب لـ Actions → Enable workflows

---

## 🎮 أوامر البوت

| الأمر | الوظيفة |
|-------|---------|
| `/start` | ▶️ تشغيل السكان |
| `/stop` | ⏹ إيقاف السكان |
| `/tf1` | ⏱ سكان على دقيقة |
| `/tf5` | ⏱ سكان على 5 دقائق |
| `/status` | 📊 الحالة الحالية |

---

## 🌐 الروابط

| الرابط | الوظيفة |
|--------|---------|
| `/` | لوحة تحكم الويب |
| `/api/scan` | تشغيل السكان يدوياً |
| `/api/status` | حالة النظام (JSON) |
