import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
from transformers import pipeline
from langchain.prompts import PromptTemplate
from langchain_community.llms import HuggingFacePipeline
import torch

# Load Firestore credentials
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), "firebase-service-account.json"))
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# Load HuggingFace Phi-4 model and pipeline
pipe = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
    max_new_tokens=128,
)
llm = HuggingFacePipeline(pipeline=pipe)

# LangChain prompt template
prompt = PromptTemplate(
    input_variables=["user_query", "po_data"],
    template="""
You are a helpful assistant for purchase order queries. The user asked: {user_query}
Here are the latest 5 purchase orders:
{po_data}
Answer the user's question as clearly as possible.
"""
)

# FastAPI app setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        user_query = data.get("query")
        if not user_id or not user_query:
            return {"response": "Missing user_id or query."}
        # Fetch latest 5 POs for the user (for now, fetch all POs, limit 5)
        pos_ref = db.collection("purchaseOrders").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(5)
        pos = [doc.to_dict() for doc in pos_ref.stream()]
        # Stringify PO data for the prompt
        po_data = json.dumps(pos, indent=2, default=str)
        # Compose prompt
        final_prompt = prompt.format(user_query=user_query, po_data=po_data)
        # Get LLM response
        response = llm(final_prompt)
        # Log query and response
        log_entry = {"user_id": user_id, "query": user_query, "response": response}
        print(json.dumps(log_entry, indent=2))
        with open(os.path.join(os.path.dirname(__file__), "chat_log.jsonl"), "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        return {"response": response}
    except Exception as e:
        print(f"Error: {e}")
        return {"response": f"An error occurred: {str(e)}"}

@app.get("/po/{po_number}")
def get_po(po_number: str):
    po = get_po_by_number(po_number)
    if po:
        return po
    return {"error": "PO not found"}

def get_po_by_number(po_number):
    pos = db.collection("purchaseOrders").where("poNumber", "==", po_number).stream()
    for doc in pos:
        return doc.to_dict()
    return None

def format_po_response(po):
    # Format the PO details for chat display
    lines = [
        f"**PO Number:** {po.get('poNumber', 'N/A')}",
        f"**Order Date:** {po.get('orderDate', 'N/A')}",
        f"**Delivery Date:** {po.get('deliveryDate', 'N/A')}",
        f"**Project Ref:** {po.get('projectRef', 'N/A')}",
        f"**Line Items:**"
    ]
    for item in po.get('lineItems', []):
        lines.append(
            f"- {item.get('description', 'N/A')} | Qty: {item.get('quantity', 'N/A')} | Price: {item.get('totalPrice', 'N/A')}"
        )
    return '\\n'.join(lines)