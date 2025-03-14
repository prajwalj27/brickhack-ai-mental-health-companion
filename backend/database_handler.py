from pymongo import MongoClient
from datetime import datetime, timedelta, timezone


def get_mongo_collection(collection_name="conversation"):
    MONGO_URL = "mongodb+srv://jc4320:uaerobp43ssuhnNl@cluster0.2tfqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(MONGO_URL)
    db = client["chatbot_db"]
    collection = db[collection_name]

    return collection

def get_all_summaries():
    collection = get_mongo_collection("summary")

    results = collection.find({}, {"_id": 0}).sort("date", -1)
    results = list(results)

    return results


def get_past_conversations(collection, limit=10):
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
            "timestamp": datetime.now(timezone.utc).isoformat()  # Store UTC time WITHOUT timezone info
        }

        result = collection.insert_one(journal_entry)
        return str(result.inserted_id)

    except Exception as e:
        raise Exception(f"Error saving journal entry: {e}")


def get_journals_by_date(date: str):
    """
    Retrieve all journal entries that match the given date string (YYYY-MM-DD).

    :param date: Date in YYYY-MM-DD format.
    :return: List of journal entries for that date.
    """
    try:
        collection = get_journal_collection()

        print(f"Fetching entries for date: {date}")

        # Query MongoDB where the timestamp starts with the given date string
        journals = list(collection.find({
            "timestamp": {"$regex": f"^{date}"}  # Matches "YYYY-MM-DDT..."
        }).sort("timestamp", 1))  # Sort by timestamp in ascending order

        # Convert ObjectId to string (but do not modify timestamp)
        for journal in journals:
            journal["_id"] = str(journal["_id"])
            # Ensure timestamp is not modified
            journal["timestamp"] = str(journal["timestamp"])  # Keep as a string

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