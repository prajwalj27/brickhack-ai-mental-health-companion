from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from llm_handler import get_results
from database_handler import get_chats_by_date, save_journal_entry, get_journals_by_date
from database_handler import get_mongo_collection
from datetime import datetime, timedelta
from typing import Optional

# Initialize FastAPI
app = FastAPI()

# Define the request body
class Prompt(BaseModel):
    prompt: str

class JournalEntry(BaseModel):
    title: str
    entry: str
    timestamp: Optional[str] = None  # ISO format timestamp

# Endpoint to receive prompt from the user
@app.post("/chat/")
async def chat(prompt: Prompt):
    """
    Receive the prompt from the user and return the response
    :param prompt:
    :return:
    """
    # Get the response from the LLM model
    response = get_results(prompt.prompt)

    return {"response": response}

@app.get("/receive_hello/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_chats_by_date/")
async def get_chats_by_date(date: str):
    """
    Fetch chatbot conversations for a given date, sorted by timestamp.
    :param date: Date in YYYY-MM-DD format
    :return: List of conversations
    """
    try:
        collection = get_mongo_collection()

        # Convert date string to datetime objects
        start_date = datetime.strptime(date, "%Y-%m-%d")
        end_date = start_date + timedelta(days=1)

        # Query MongoDB for records within the given date range
        conversations = list(collection.find(
            {"timestamp": {"$gte": start_date, "$lt": end_date}}
        ).sort("timestamp", 1))

        # Convert ObjectId and timestamp to readable format
        for convo in conversations:
            convo["_id"] = str(convo["_id"])
            convo["timestamp"] = convo["timestamp"].isoformat()

        return conversations

    except Exception as e:
        raise Exception(f"Error fetching conversations: {e}")  # Check formatting


@app.get("/conversations/")
async def get_conversations(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    Get all chatbot conversations for a given date, sorted by timestamp.
    :param date: Date in YYYY-MM-DD format
    :return: List of conversations
    """
    try:
        conversations = get_chats_by_date(date)
        return {"date": date, "conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/journal/")
async def create_journal(journal: JournalEntry):
    """
    Store a new journal entry in MongoDB.
    """
    try:
        journal_id = save_journal_entry(journal.title, journal.entry)
        return {"message": "Journal entry saved successfully", "journal_id": journal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/journal/")
async def get_journal_entries(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    Retrieve all journal entries for a given date, sorted by timestamp.
    """
    try:
        journals = get_journals_by_date(date)
        return {"date": date, "journals": journals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))