# Cally Assessment Hub

**Cally Assessment Hub** is a modern, full-stack web application designed for Business Process Outsourcing (BPO) candidate screening, linguistic proficiency testing, and technical skills evaluation. Developed by **TephdyTech**, the platform features automated simulations, historical progress tracking, and verifiable PDF certificate generation.

---

## 🚀 Key Features

* **Authentication & User Management**: Secure login and account registration via Supabase Auth (Google OAuth or Email/Password credentials).
* **5 Core BPO Assessment Modules**:
  1. 🎧 **Listening & Dictation**: Single-play audio drills with dictation inputs and auto-evaluations under time pressure.
  2. 📖 **Sentence Completion & Grammar**: SVAR vocabulary fill-in-the-blanks and grammar rules comprehension.
  3. ✍️ **Customer Email & Chat Writing**: Professional customer service response drafting and evaluation.
  4. 🎙️ **Repeat & Retell AI**: Speaking simulation with audio recording and voice critique components.
  5. ⌨️ **Chat & Typing Speed Test**: Real-time Net Words Per Minute (WPM) and accuracy calculation for candidate screening.
* **Full Exam Pathway**: A structured 5-step sequential examination mode that compiles module performance into a cumulative rating.
* **Verifiable Certification**: Automatically generates an official electronic certificate complete with a custom verification code, score breakdown, and instant export to `.pdf` format using `html2pdf.js`.
* **Performance Logs & Historical Analytics**: Chronological tracking of every test attempt, score evolution, historical averages, and improvement metrics.
* **Dynamic UI Themes**: Seamless theme switching between **Light**, **Dark**, and **Midnight** modes with persistent storage.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (React / App Router / TypeScript)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL Database, Auth, and Table Integration)
* **PDF Export**: `html2pdf.js`
* **Audio & Speech**: Web Speech API / HTML5 Audio & Custom Media Recorders

---

## 📋 Database Schema (Supabase)

The application expects the following core tables configured in your Supabase project:

1. **`users`**
   * `id` (UUID / Primary Key)
   * `email` (Text / Unique)
   * `name` (Text)
   * `created_at` (Timestamp)

2. **`module_scores`**
   * `id` (UUID / Primary Key)
   * `user_id` (UUID / Foreign Key to `users`)
   * `module_name` (Text)
   * `score` (Integer)
   * `created_at` (Timestamp)

3. **`certificates`**
   * `id` (UUID / Primary Key)
   * `user_id` (UUID / Foreign Key to `users`)
   * `certificate_code` (Text)
   * `overall_score` (Integer)
   * `created_at` (Timestamp)

---

## ⚙️ Getting Started & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/cally-assessment-hub.git](https://github.com/your-username/cally-assessment-hub.git)
cd cally-assessment-hub
2. Install Dependencies
Bash
npm install
# or
yarn install
3. Configure Environment Variables
Create a .env.local file in the root directory of your project and add your Supabase credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Run the Development Server
Bash
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to view the application.

📦 Project Structure
app/page.tsx — Main application dashboard, authentication state controller, and module routing logic.

components/AudioPlayer.tsx — Single-play audio drill handler.

components/SpeakingRecorder.tsx — Microphone recording and speaking simulation utility.

lib/supabase.ts — Supabase client configuration.

📄 License & Credits
Developed by TephdyTech.
All rights reserved © 2026.
