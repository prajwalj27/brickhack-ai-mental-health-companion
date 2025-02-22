from fastapi import FastAPI
from pydantic import BaseModel
from llm_handler import get_results

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
