from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# In-memory chat history
chat_history: List[Dict[str, str]] = []

# Pydantic model for incoming user messages
class UserMessage(BaseModel):
    text: str


@app.post("/api/chat")
async def chat_with_openai(message: UserMessage):
    """
    Endpoint to send user input to OpenAI and get a response.
    """
    try:
        # Send message to OpenAI
        response = openai.Completion.create(
            engine="text-davinci-003",  # GPT model
            prompt=message.text,
            max_tokens=150,
            temperature=0.0,
        )

        # Extract the response text
        gpt_response = response.choices[0].text.strip()

        # Save the chat to history
        chat_history.append({"user": message.text, "bot": gpt_response})

        return {"reply": gpt_response, "history": chat_history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")


@app.get("/api/history")
async def get_chat_history():
    """
    Endpoint to retrieve the entire chat history.
    """
    return {"history": chat_history}
