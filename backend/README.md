# ⚡ AI Mental Health Companion – Backend (FastAPI)

## 📝 About

This is the **backend** for the AI-powered mental health companion app, built using **FastAPI**. It serves as the backbone for:

- **AI Chatbot** – Context-aware, empathetic AI conversations powered by **LangChain (RAG)**.
- **Journal & Meditation APIs** – Storing user journal entries and meditation session logs.
- **Weaviate Vector Search** – Retrieving past therapy-like conversations for personalized responses.

---

## ⚡ Setup Instructions

### **1. Install Dependencies**

Ensure **Python 3.8+** is installed, then run:

```sh
pip install -r requirements.txt
```


### **2. Add Environment Variables (`.env` file)**

Create a **`.env`** file in the **backend root directory** and add the following:

```sh
OPENAI_API_KEY=your_openai_api_key_here
WCD_URL=your_weaviate_db_url_here
WCD_API_KEY=your_weaviate_api_key_here
```

*(Replace `your_openai_api_key_here`, `your_weaviate_db_url_here`, and `your_weaviate_api_key_here` with actual credentials.)*

---

### **3. Run the FastAPI Backend**

Start the backend using **Uvicorn**:

```sh
python main.py
```

or manually using:

```sh
uvicorn fast_api:app --host 0.0.0.0 --port 8000 --reload
```

🔹 This will host the API on `http://0.0.0.0:8000`.

---

## 🔥 API Documentation

Once running, you can view the interactive API documentation at:
📌 **Swagger UI:** [`http://localhost:8000/docs`](http://localhost:8000/docs)
📌 **Redoc:** [`http://localhost:8000/redoc`](http://localhost:8000/redoc)

---

## More Details

For Frontend setup, refer to the **[Backend README](../frontend/README.md)**.
For Backend setup, revisit **this README** anytime.
