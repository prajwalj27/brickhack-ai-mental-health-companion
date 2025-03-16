from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from llm_handler import get_results
from mongodb_database_handler import get_chats_by_date, save_journal_entry, get_journals_by_date
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()
# Allow CORS for all domains (for testing purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define the request body
class Prompt(BaseModel):
    prompt: str

class JournalEntry(BaseModel):
    title: str
    entry: str
    timestamp: Optional[str] = None  # ISO format timestamp


@app.post("/chat/")
async def chat(prompt: Prompt):
    """
    Receive the prompt from the user and return the response
    :param prompt:
    :return: the response from the LLM model
    """
    # Get the response from the LLM model
    response = get_results(prompt.prompt)

    return {"response": response}


@app.get("/receive_hello/")
async def root():
    """
    Simple Hello World endpoint for testing
    :return: a message
    """
    return {"message": "Hello World"}


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
    Save a journal entry to the journal collection in MongoDB
    :param journal: the journal entry
    :return: acknowledgement message
    """
    try:
        journal_id = save_journal_entry(journal.title, journal.entry)
        return {"message": "Journal entry saved successfully", "journal_id": journal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/journal/")
async def get_journal_entries(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    Get all journal entries for a given date
    :param date: the date in YYYY-MM-DD format
    :return: the journal entries
    """
    try:
        journals = get_journals_by_date(date)
        return {"date": date, "journals": journals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))