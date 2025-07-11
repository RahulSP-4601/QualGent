from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    messages: list

@router.post("/chat")
async def chat_with_ai(req: ChatRequest):
    try:
        client = openai.OpenAI(api_key=openai.api_key)

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that helps generate test cases in the format:\n\nTest case name: <name>\nDescription: <description>\nRespond only in that format."},
                *req.messages
            ],
            temperature=0.4,
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        return {"error": str(e)}
