from pymongo import MongoClient


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