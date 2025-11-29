# Solara -- AI Chatbot Web App

Solara is a lightweight, browser-based AI chatbot interface built with
HTML, CSS, and JavaScript. This project focuses on a clean UI, smooth
interaction, and simple API-style messaging --- perfect for beginners
who want to understand how chat interfaces work.

> **Note:** Solara is just a chatbot UI. It does not contain or connect
> to any real AI backend unless you integrate one.

------------------------------------------------------------------------

## 🚀 Features

-   Clean and minimal chat interface\
-   Auto-scroll chat window\
-   Press **Enter** to send messages\
-   Built-in simulated AI response (customizable)\
-   Ability to download a **Wellbeing Report** as a `.txt` file\
-   Responsive design

------------------------------------------------------------------------

## 📁 Project Structure

    /
    ├── index.html
    ├── style.css
    ├── script.js
    └── assets/
          └── (optional images/icons)

------------------------------------------------------------------------

## ⚙️ How It Works

-   Messages are captured from the input box\
-   Pressing **Enter** or clicking **Send** triggers the `sendMessage()`
    function\
-   The chatbot (Solara) replies using mocked responses\
-   A Wellbeing Report is generated from the chat and downloaded as a
    `.txt` file

------------------------------------------------------------------------

## 📝 How to Use

1.  Clone or download the repository\
2.  Open `index.html` in any browser\
3.  Start chatting with Solara\
4.  Click **Download Report** to export the conversation

------------------------------------------------------------------------

## 🛠️ Customization

### Change Solara's personality

Modify `generateBotResponse()` in `script.js`.

### Connect to a real AI model

Replace the mock response with an API call (OpenAI, Gemini, etc.)

------------------------------------------------------------------------

## 💡 Future Improvements

-   Backend integration\
-   Save chat history\
-   Dark/light themes\
-   Voice support

------------------------------------------------------------------------

## 🤝 Contributing

Fork the repo, open issues, or submit PRs!

------------------------------------------------------------------------

## 📜 License

MIT License

------------------------------------------------------------------------

## 🙌 Author

Created by **Abdullah**
