from pymongo import MongoClient
from datetime import datetime, timedelta


def get_mongo_collection():
    MONGO_URL = "mongodb+srv://jc4320:uaerobp43ssuhnNl@cluster0.2tfqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(MONGO_URL)
    db = client["chatbot_db"]
    collection = db["conversation"]

    return collection

def get_past_conversations(collection, limit=1000):
    """
    Return a list of past messages.
    :param limit:
    :param collection:
    :return:
    """
    past_messages = (collection.find({}, {"user_input": 1, "response": 1, "_id": 0})
                     .sort([("timestamp", -1)])
                     .limit(limit))

    formatted_messages = [{"user_input": message["user_input"],
                           "response": message["response"]}
                          for message in past_messages]

    return formatted_messages

def get_journal_collection():
    """
    Get the MongoDB collection for storing journal entries.
    """
    collection = get_mongo_collection().database["journal"]
    return collection


def save_journal_entry(title: str, entry: str):
    """
    Store a new journal entry in the journal collection.
    :param title: Title of the journal entry
    :param entry: The journal entry text
    :return: Inserted journal entry ID
    """
    try:
        collection = get_journal_collection()

        journal_entry = {
            "title": title,
            "entry": entry,
            "timestamp": datetime.utcnow()  # Store UTC time WITHOUT timezone info
        }

        result = collection.insert_one(journal_entry)
        return str(result.inserted_id)

    except Exception as e:
        raise Exception(f"Error saving journal entry: {e}")


def get_journals_by_date(date: str):
    """
    Retrieve all journal entries for a given date, ordered by timestamp.
    :param date: Date in YYYY-MM-DD format
    :return: List of journal entries
    """
    try:
        collection = get_journal_collection()

        # Convert date to datetime range (Naive UTC)
        start_date = datetime.strptime(date, "%Y-%m-%d")
        end_date = start_date + timedelta(days=1)

        # Query MongoDB for records within the given date range
        journals = list(collection.find(
            {"timestamp": {"$gte": start_date, "$lt": end_date}}
        ).sort("timestamp", 1))

        # Convert ObjectId and timestamp to readable format
        for journal in journals:
            journal["_id"] = str(journal["_id"])
            journal["timestamp"] = journal["timestamp"].isoformat()  # Keep as naive UTC

        return journals

    except Exception as e:
        raise Exception(f"Error fetching journal entries: {e}")


def get_chats_by_date(date: str):
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
            convo["_id"] = str(convo["_id"])  # Convert ObjectId to string
            convo["timestamp"] = convo["timestamp"].isoformat()  # Convert timestamp to readable format

        return conversations

    except Exception as e:
        raise Exception(f"Error fetching conversations: {e}")