import weaviate
import weaviate.classes as wvc
import os
from dotenv import load_dotenv
import json
from tqdm import tqdm

# Load environment variables
load_dotenv()
WCD_URL = os.getenv("WCD_URL")
WCD_API_KEY = os.getenv("WCD_API_KEY")

# Ensure Environment Variables Are Loaded
if not WCD_URL or not WCD_API_KEY:
    raise ValueError("ERROR: WCD_URL or WCD_API_KEY is missing. Check your .env file!")

def get_client():
    # Connect to Weaviate Cloud
    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=WCD_URL,
        auth_credentials=wvc.init.Auth.api_key(WCD_API_KEY)
    )

    return client

def handle_schema_creation(client):
    try:
        # Define Schema for TherapySession Collection
        if "TherapySession" not in [col.name for col in client.collections.list_all()]:
            therapy_session = client.collections.create(
                name="TherapySession",
                description="A collection of therapy session transcripts.",
                vectorizer_config=wvc.config.Configure.Vectorizer.none(),  # We'll provide our own OpenAI embeddings
                properties=[
                    wvc.config.Property(
                        name="session_id",
                        data_type=wvc.config.DataType.TEXT,
                    ),
                    wvc.config.Property(
                        name="text",
                        data_type=wvc.config.DataType.TEXT,
                    )
                ]
            )
            print("TherapySession schema created successfully!")

            # Print schema details for verification
            print(therapy_session.config.get(simple=False))
        else:
            print("TherapySession schema already exists!")

    finally:
        # Close connection to prevent memory leaks
        client.close()


def upload_embedded_transcripts(client, embedded_transcript_path):
    try:
        # Load embedded transcripts from JSON file
        with open(embedded_transcript_path, "r") as file:
            embedded_transcripts = json.load(file)

        # Upload embedded transcripts to Weaviate
        therapy_session_class = client.collections.get("TherapySession")

        for chunk in tqdm(embedded_transcripts, desc="Uploading Chunks to Weaviate"):
            therapy_session_class.data.insert(
                properties={
                    "session_id": chunk["session_id"],
                    "text": chunk["text"],
                },
                vector=chunk["embedding"]  # Store OpenAI-generated vector
            )

        print("All chunks uploaded to Weaviate successfully!")

    finally:
        # Close connection to prevent memory leaks
        client.close()

# handle_schema_creation(get_client())
# upload_embedded_transcripts(get_client(), "embedded_transcript.json")




client = get_client()

# Fetch a specific object by ID
object_id = "00937e60-80bd-4f49-9387-4db6ac12d1ec"  # Replace with an actual ID from Weaviate
therapy_session = client.collections.get("TherapySession")
retrieved_object = therapy_session.query.fetch_object_by_id(object_id, include_vector=True)

# Print the retrieved object with its vector
print(retrieved_object.properties)  # Shows session_id and text
print(retrieved_object.vector)  # Should display the vector

client.close()




