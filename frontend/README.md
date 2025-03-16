# React Native Expo Frontend

This is the **frontend** component of our AI Mental Health Companion, built with [Expo](https://expo.dev). It provides a **clean and intuitive UI** for users to chat with the AI, journal their thoughts, and meditate with calming sounds.

## ✨ Features

1. **Conversational AI Chat** – Talk to an empathetic AI companion about your emotions.
2. **Journaling** – Log your daily thoughts and moods.
3. **Meditation** – Timer and soothing sounds to help you find calm.
4. **User Management (Clerk)** – Easily manage user sign-up and login.

---

## 🖼 UI Sneak Peek

Below are a few screenshots showcasing the **app's UI**.

| Onboarding                                                                                                                         | Signup | Login |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| ![Onboarding](https://github.com/prajwalj27/brickhack-ai-mental-health-companion/blob/main/frontend/assets/images/UI/onboarding.jpg) |        |       |

| Home Screen | Journal Screen | Meditate Screen |
| ----------- | -------------- | --------------- |
|             |                |                 |



<img src="https://github.com/prajwalj27/brickhack-ai-mental-health-companion/blob/main/frontend/assets/images/UI/onboarding.jpg" alt="Chat Screen" width="300">


---

## 🚀 Getting Started

### 1. Installation

1. Clone the repository

   ```bash
   git clone https://github.com/<your-repo>.git
   cd <your-repo>/frontend
   ```
2. Install dependencies

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

### 2. Adding Your API Keys

We use **Clerk** for user management. Go to your `.env` file or create a new one in your project root (if it doesn’t exist) and add:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
```

*(Note: The prefix `EXPO_PUBLIC_` ensures the variable is accessible at runtime in Expo.)*

### 3. Setting the `baseURL`

The frontend **needs to connect** to the FastAPI backend. Obtain your **local machine IP address** by running:

```bash
ipconfig
```

on Windows (or `ifconfig` on macOS/Linux). Then, **update** `constants/index.tsx` with the correct IP and port:

```ts
// constants/index.tsx
export const baseURL = "http://<YOUR-IP-ADDRESS>:8000";
```

### 4. Running the Expo App

1. Start the development server:
   ```bash
   npx expo start
   ```
2. Choose one of the options in the Expo CLI output:
   * Open the app in an **Android emulator** or  **iOS simulator** .
   * Scan the QR code with **Expo Go** on your physical device.
   * Use a **development build** or **web** preview if needed.

---

## 🛠 Project Structure

```bash
frontend/
  ├── app/                  # Main app directory with file-based routing
  ├── components/           # Components created for the frontend
  ├── constants/            # Contains baseURL and other constants used for development
  ├── assets/               # Images, sounds, icons
  ├── .env                  # Environment variables (Clerk keys, etc.)
  ├── package.json
  └── README.md             # You're here!
```

## 🙏 Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

Thank you for helping make this mental health companion better for everyone!

---

**Enjoy building and exploring our AI Mental Health Companion frontend!**
