# User Manual Documentation

คู่มือการใช้งานโปรแกรม - สร้างด้วย Docusaurus

## 📁 โครงสร้างโฟลเดอร์

```
docs/
├── docs/                    # เนื้อหาเอกสารทั้งหมด
│   ├── index.md            # หน้าแรก
│   ├── getting-started/    # เริ่มต้นใช้งาน
│   ├── features/           # ฟีเจอร์ต่าง ๆ
│   ├── screenshots/        # คู่มือภาพประกอบ
│   ├── faq.md             # คำถามที่พบบ่อย
│   └── contact.md         # ติดต่อเรา
├── static/                 # ไฟล์ static
│   └── img/               # รูปภาพ
│       ├── screenshots/   # รูปหน้าจอ
│       ├── step-by-step/  # รูปคู่มือทีละขั้นตอน
│       ├── troubleshooting/ # รูปแก้ไขปัญหา
│       └── contact/       # รูปติดต่อ
├── docusaurus.config.js   # การตั้งค่า Docusaurus
├── sidebars.js           # การตั้งค่า sidebar
└── export-pdf.js         # สคริปต์ส่งออก PDF
```

## 🚀 การใช้งาน

### 1. เริ่มต้นเซิร์ฟเวอร์พัฒนา

```bash
npm start
```

เข้าชมที่: http://localhost:3000

### 2. สร้างเวอร์ชั่น production

```bash
npm run build
```

ผลลัพธ์อยู่ในโฟลเดอร์ `build/`

### 3. ส่งออกเป็น PDF

```bash
# วิธีที่ 1: ใช้ docusaurus-to-pdf
npm run pdf

# วิธีที่ 2: ใช้สคริปต์ที่เตรียมไว้
npm run export-pdf
```

PDF จะถูกบันทึกที่ `static/pdf/user-manual.pdf`

## 📝 การเพิ่มเนื้อหา

### เพิ่มหน้าใหม่

1. สร้างไฟล์ `.md` ในโฟลเดอร์ `docs/`
2. เพิ่ม frontmatter:

```markdown
---
sidebar_position: 1
---

# ชื่อหัวข้อ

เนื้อหาที่ต้องการ...
```

### เพิ่มรูปภาพ

1. วางรูปใน `static/img/screenshots/`
2. อ้างอิงใน markdown:

```markdown
![คำอธิบายรูป](../img/screenshots/filename.png)
```

### แก้ไข sidebar

แก้ไขไฟล์ `sidebars.js` เพื่อเพิ่ม/ลบ/ย้ายเมนู

## 🌐 การ deploy

### Deploy บน GitHub Pages

```bash
npm run deploy
```

หรือใช้ GitHub Actions (ดูตัวอย่างใน `.github/workflows/`)

### Deploy บน Vercel/Netlify

1. เชื่อมต่อ repository
2. ตั้งค่า build command: `npm run build`
3. ตั้งค่า output directory: `build`

## 🎨 การปรับแต่ง

### เปลี่ยนชื่อเว็บไซต์

แก้ไขใน `docusaurus.config.js`:

```javascript
title: 'ชื่อใหม่',
tagline: 'สโลแกนใหม่',
```

### เปลี่ยนสีธีม

แก้ไขใน `src/css/custom.css`

### เพิ่มภาษา

แก้ไขใน `docusaurus.config.js` ในส่วน `i18n`

## 📸 การเพิ่มรูปภาพประกอบ

### รูปภาพที่ต้องเพิ่ม (ตัวอย่าง)

วางรูปจริงของโปรเจ็คคุณแทนที่ไฟล์ตัวอย่าง:

**หน้าเข้าสู่ระบบและลงทะเบียน:**
- `static/img/screenshots/login-page.png`
- `static/img/screenshots/register-page.png`
- `static/img/screenshots/install-pwa.png`
- `static/img/screenshots/profile-setup.png`

**แดชบอร์ด:**
- `static/img/screenshots/dashboard.png`
- `static/img/screenshots/dashboard-full.png`
- `static/img/screenshots/stats-widget.png`
- `static/img/screenshots/charts.png`
- `static/img/screenshots/recent-activity.png`

**การจัดการผู้ใช้:**
- `static/img/screenshots/user-list.png`
- `static/img/screenshots/add-user.png`
- `static/img/screenshots/roles.png`
- `static/img/screenshots/edit-user.png`

**การตั้งค่า:**
- `static/img/screenshots/settings-page.png`
- `static/img/screenshots/account-settings.png`
- `static/img/screenshots/change-password.png`
- `static/img/screenshots/notification-settings.png`
- `static/img/screenshots/language-settings.png`
- `static/img/screenshots/2fa-setup.png`
- `static/img/screenshots/login-history.png`

**และอื่น ๆ ตามที่ระบุในไฟล์ .md แต่ละไฟล์**

## 🛠️ การแก้ไขปัญหา

### พบข้อผิดพลาด "Module not found"

```bash
rm -rf node_modules
npm install
```

### PDF export ไม่ทำงาน

1. ตรวจสอบว่า install dependencies ครบ:
```bash
npm install
```

2. ใช้วิธี manual:
```bash
npm run build
npm run serve
# เปิดเบราว์เซอร์ไปที่ http://localhost:3000
# กด Ctrl+P และเลือก "Save as PDF"
```

## 📚 เอกสารอ้างอิง

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [PDF Export Plugin](https://github.com/jean-humann/docs-to-pdf)

## 📄 License

Copyright © 2026 Your Project. All rights reserved.
