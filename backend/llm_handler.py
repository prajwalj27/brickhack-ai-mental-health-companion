from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from datetime import datetime, timezone
from langchain_core.output_parsers import StrOutputParser
from transformers import pipeline
from database_handler import get_mongo_collection, get_past_conversations, get_all_summaries
import os
from langchain_openai import OpenAIEmbeddings
import weaviate
import weaviate.classes as wvc


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

def initialize_llm(model="gpt-4o-mini"):
    """
    * Initialize the LLM model
    * Also, includes getting API key from .env file
    :return:
    """
    # Load environment variables
    load_dotenv()

    # Initialize the LLM model
    llm_gpt4o = ChatOpenAI(model=model)

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
    
    Here are all available summaries from chat and journal entries:
    {summaries}
    
    Following is the user’s latest message.
    User: {user_input}
    
    Following is the sentiment score of the user's latest message: {sentiment_score} 
    The score ranges from -1 to 1. -1 means negative sentiment, 1 means positive sentiment and 0 means neutral sentiment. 
    You should consider the sentiment score while replying back to user's message. If the sentiment score is negative, 
    you should be more empathetic and understanding. If the sentiment score is positive, you should be more encouraging 
    and supportive but not too cheerful.
    
    Note: Do not repeat what the user is saying. Do not say I understand and repeat exactly what the user is saying. If 
    you think the user is trying it get reassurance, go with flow and give him that reassurance, but dont be over excited.
    Try to have a conversation. And dont keep asking only questions. Keep it natural.
    """

    return system_prompt

def summarize(text):
    llm_gpt4o_mini = initialize_llm("gpt-4o-mini")
    prompt = """
    Your only task to summarize the given text. Do not add any additional information. Each object has its own date"""

def get_results(user_prompt):
    """
    Receives user's prompt from the user. Invokes the LLM model to get the response.
    :param user_prompt:
    :return:
    """
    # Get model instance
    llm = initialize_llm("gpt-4o")

    # Get system prompt
    system_prompt = get_system_prompt()



    # Get relevant chunks from the transcript
    relevant_chunks = retrieve_relevant_chunks(user_prompt)



    # Short Term Context - Last 10 conversation
    collection = get_mongo_collection("conversation")
    # Get past conversations
    past_conversations = get_past_conversations(collection)
    # Convert past conversations into a string
    past_conversations_context = "\n".join([f"user_input: {msg['user_input']}\nresponse: {msg['response']}" for msg in past_conversations])


    # Long Term context - All summaries
    summaries = get_all_summaries()
    # Format summaries
    summaries_context = "\n".join([
        f"Date: {s['date']}\nOverall Mood: {s['overall_mood']}\nSentiment Score: {s['sentiment_score']}\n"
        f"Chat Summary: {s['chat_summary']}\nJournal Summary: {s['journal_summary']}\n"
        for s in summaries]) if summaries else "No summaries available."



    # Get the sentiment of the user's prompt - normalize the score
    sentiment_score = analyze_sentiment(user_prompt)

    # Format the system prompt with context
    formatted_prompt = system_prompt.format(past_conversation=past_conversations_context,
                                            user_input=user_prompt,
                                            sentiment_score=sentiment_score,
                                            summaries=summaries_context)

    prompt = PromptTemplate(
        template=formatted_prompt,
        input_variables=[]
    )

    output_parser = StrOutputParser()

    chain = prompt | llm | output_parser

    result =  chain.invoke({})

    collection = get_mongo_collection("conversation")
    collection.insert_one(
        {"user_input": user_prompt,
         "sentiment_score": sentiment_score,
         "response": result,
         "timestamp": datetime.now(timezone.utc).isoformat()}
    )

    return result

def retrieve_relevant_chunks(user_prompt, top_k=5):
    """
    Retrieve the top-k most relevant chunks of text from Weaviate DB based on the user's prompt.
    :param user_prompt: The user's input query
    :param top_k: Number of relevant results to return
    :return: List of relevant text chunks with session ID and similarity score
    """

    # Load environment variables
    load_dotenv()
    WCD_URL = os.getenv("WCD_URL")
    WCD_API_KEY = os.getenv("WCD_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    if not WCD_URL or not WCD_API_KEY or not OPENAI_API_KEY:
        raise ValueError("ERROR: Missing required environment variables in .env file!")

    # Connect to Weaviate
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=WCD_URL,
        auth_credentials=wvc.init.Auth.api_key(WCD_API_KEY)
    )

    # Initialize OpenAI LangChain Embeddings
    embedder = OpenAIEmbeddings()

    try:
        # Convert User Prompt to OpenAI Embedding
        query_embedding = embedder.embed_query(user_prompt)

        # Perform Vector Search in Weaviate
        therapy_session = client.collections.get("TherapySession")

        results = therapy_session.query.near_vector(
            near_vector=query_embedding,
            limit=top_k,
            return_metadata=wvc.query.MetadataQuery(distance=True),  # ✅ Corrected
        )

        # Extract Retrieved Chunks Safely
        relevant_chunks = []
        if results.objects:  # Ensure objects exist in the response
            for result in results.objects:
                relevant_chunks.append({
                    "text": result.properties.get("text", ""),
                    "session_id": result.properties.get("session_id", ""),
                    "score": getattr(result.metadata, "score", 0)
                })

        return relevant_chunks

    finally:
        client.close()


