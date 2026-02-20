#!/usr/bin/env python3
"""
Reminder Checker - Run by Cron every day at 8:00 AM
ตรวจสอบ reminders สำหรับวันนี้และส่งการแจ้งเตือนไปยัง Telegram
"""

import os
import sys
from datetime import datetime, timedelta

def check_and_notify():
    """ตรวจสอบ reminders สำหรับวันนี้และส่งสรุป"""
    
    reminders_file = "/root/.openclaw/workspace/reminders.md"
    
    if not os.path.exists(reminders_file):
        print("❌ ไม่พบไฟล์ reminders.md")
        return []
    
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    
    # เก็บ reminders สำหรับวันนี้
    today_reminders = []
    upcoming_reminders = []
    
    with open(reminders_file, 'r') as f:
        lines = f.readlines()
    
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        try:
            parts = line.split('|')
            if len(parts) >= 3:
                date_str = parts[0].strip()
                message = parts[1].strip()
                reminder_type = parts[2].strip()
                
                reminder_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
                reminder_day = reminder_date.strftime("%Y-%m-%d")
                
                # แยก reminders สำหรับวันนี้และ 7 วันข้างหน้า
                if reminder_day == today:
                    today_reminders.append((reminder_date, message, reminder_type))
                elif today < reminder_day <= (now + timedelta(days=7)).strftime("%Y-%m-%d"):
                    upcoming_reminders.append((reminder_date, message, reminder_type))
                    
        except Exception as e:
            print(f"⚠️ Error parsing line: {e}")
    
    # สร้างข้อความแจ้งเตือน
    if today_reminders or upcoming_reminders:
        # เรียงตามเวลา
        today_reminders.sort(key=lambda x: x[0])
        upcoming_reminders.sort(key=lambda x: x[0])
        
        emoji_map = {
            "assignment": "📚",
            "meeting": "📅", 
            "deadline": "⏰",
            "exam": "📝",
            "other": "🔔"
        }
        
        message_parts = []
        message_parts.append(f"📅 **Reminder Summary - {today}**\n")
        
        # Reminders สำหรับวันนี้
        if today_reminders:
            message_parts.append("⏰ **วันนี้มีกำหนด:**\n")
            for dt, msg, rtype in today_reminders:
                emoji = emoji_map.get(rtype, "🔔")
                time_str = dt.strftime("%H:%M")
                message_parts.append(f"{emoji} {time_str} - {msg}")
            message_parts.append("")
        
        # Reminders ที่กำลังจะมาถึง
        if upcoming_reminders[:5]:  # แสดงแค่ 5 รายการแรก
            message_parts.append("📋 **กำลังจะมาถึง (7 วันข้างหน้า):**\n")
            for dt, msg, rtype in upcoming_reminders[:5]:
                emoji = emoji_map.get(rtype, "🔔")
                date_str = dt.strftime("%Y-%m-%d %H:%M")
                days_left = (dt - now).days
                if days_left == 1:
                    day_text = "พรุ่งนี้"
                else:
                    day_text = f"อีก {days_left} วัน"
                message_parts.append(f"{emoji} {msg} ({day_text})")
            message_parts.append("")
        
        message_parts.append("จาก KoongAI 🤖")
        
        notification = "\n".join(message_parts)
        
        # ส่งผ่าน openclaw message - ไปยัง Reminder System Group
        safe_message = notification.replace('"', '\\"')
        cmd = f'openclaw message send --target -1003351003185 --message "{safe_message}"'
        result = os.system(cmd)
        
        if result == 0:
            print(f"✅ ส่งการแจ้งเตือนสำเร็จ")
            print(f"   📌 วันนี้: {len(today_reminders)} รายการ")
            print(f"   📋 กำลังจะมาถึง: {len(upcoming_reminders)} รายการ")
        else:
            print(f"❌ ส่งการแจ้งเตือนไม่สำเร็จ (exit code: {result})")
        
        return today_reminders + upcoming_reminders
    else:
        print("📭 ไม่มี reminders สำหรับวันนี้และ 7 วันข้างหน้า")
        return []

if __name__ == "__main__":
    print(f"🔔 Checking reminders at {datetime.now()}")
    notified = check_and_notify()
    if notified:
        print(f"📨 Total: {len(notified)} reminder(s)")
