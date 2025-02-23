from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from datetime import datetime
from langchain_core.output_parsers import StrOutputParser
from transformers import pipeline
from database_handler import get_mongo_collection, get_past_conversations


def analyze_sentiment(text):
    """
    This functions takes in a text and returns the sentiment of the text.
    :param text:
    :return:
    """
    sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
    result = sentiment_analyzer(text)
    label = result[0]["label"].lower()
    score = result[0]["score"]

    sentiment_mapping = {
        "positive": 1,
        "negative": -1,
        "neutral": 0
    }

    normalized_score = sentiment_mapping[label] * score

    if label == "neutral":
        if score > 0.7:
            normalized_score = 0.2
        elif normalized_score < 0.3:
            normalized_score = -0.2
        else:
            normalized_score = 0

    return normalized_score

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
    You are a therapist. You have to be calm, gentle, understanding and empathetic. You have to listen to the user and 
    respond accordingly. You do not have to be too cheerful. You have to resonate with the user and listen the user's 
    problem. Dont give solutions. Your task is to listen. If you do not understand what the user is saying, be patient,
    do not output gibberish. Ask the user to explain more, but do not be too direct. Be indirect and gentle.
    
    Here is the past conversation history:
    {past_conversation}
    
    Following is the user’s latest message.
    User: {user_input}
    
    Following is the sentiment score of the user's latest message: {sentiment_score} 
    The score ranges from -1 to 1. -1 means negative sentiment, 1 means positive sentiment and 0 means neutral sentiment. 
    You should consider the sentiment score while replying back to user's message. If the sentiment score is negative, 
    you should be more empathetic and understanding. If the sentiment score is positive, you should be more encouraging 
    and supportive but not too cheerful.
    
    Note: Do not repeat what the user is saying. Do not say I understand and repeat exactly what the user is saying.
    """

    return system_prompt

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

    # Get past conversations
    past_conversations = get_past_conversations(collection)

    # Convert past conversations into a string
    past_conversations_context = "\n".join([f"user_input: {msg['user_input']}\nresponse: {msg['response']}" for msg in past_conversations])

    # Get the sentiment of the user's prompt - normalize the score
    sentiment_score = analyze_sentiment(user_prompt)

    # Format the system prompt with context
    formatted_prompt = system_prompt.format(past_conversation=past_conversations_context,
                                            user_input=user_prompt,
                                            sentiment_score=sentiment_score)

    prompt = PromptTemplate(
        template=formatted_prompt,
        input_variables=[]
    )

    output_parser = StrOutputParser()

    chain = prompt | llm | output_parser

    result =  chain.invoke({})

    collection.insert_one(
        {"user_input": user_prompt,
         "sentiment_score": sentiment_score,
         "response": result,
         "timestamp": datetime.utcnow()}
    )

    return result