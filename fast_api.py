from fastapi import FastAPI
from pydantic import BaseModel
from llm_handler import get_results
from database_handler import get_mongo_collection
from datetime import datetime, timedelta

# Initialize FastAPI
app = FastAPI()

# Define the request body
class Prompt(BaseModel):
    prompt: str

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

