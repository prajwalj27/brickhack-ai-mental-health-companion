from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from pymongo import MongoClient
from datetime import datetime


def get_mongo_collection():
    MONGO_URL = "mongodb+srv://jc4320:uaerobp43ssuhnNl@cluster0.2tfqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(MONGO_URL)
    db = client["chatbot_db"]
    collection = db["conversation"]

    return collection

def initialize_llm():
    """
    * Initialize the LLM model
    * Also, includes getting API key from .env file
    :return:
    """
    # Load environment variables
    load_dotenv()

    # Initialize the LLM model
    llm_gpt4o = ChatOpenAI(model="gpt-4o")

    return llm_gpt4o

def get_system_prompt():
    """
    Return the system prompt
    :return:
    """
    system_prompt = """
    You have to behave like a human. You are therapist. you have to be calm, gentle, understanding
    and empathetic. You have to listen to the user and respond accordingly. You do not have to be too cheerful.
    You have to resonate with the user and listen the user's problem. Dont give solutions. Your task is to listen.
    This is what the user is saying: {user_input}"""

    return system_prompt

def get_past_conversations(collection):
    """
    Return a list of past 5 messages.
    :param collection:
    :return:
    """
    past_messages = collection.find().sort


def get_results(user_prompt):
    """
    Receives user's prompt from the user. Invokes the LLM model to get the response.
    :param user_prompt:
    :return:
    """
    # Get model instance
    llm = initialize_llm()

    # Get system prompt
    system_prompt = get_system_prompt()

    # Get the collection
    collection = get_mongo_collection()

    prompt = PromptTemplate(
        template=system_prompt,
        input_variables=["user_input"]
    )

    chain = prompt | llm

    result =  chain.invoke({"user_input": user_prompt}).content

    collection.insert_one(
        {"user_input": user_prompt,
         "response": result,
         "timestamp": datetime.utcnow()}
    )

    return result