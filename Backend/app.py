from fastapi import FastAPI, Request
from pydantic import BaseModel # Validates the request body
from transformers import AutoTokenizer, T5ForConditionalGeneration # to load the model and tokenizer that we have saved
import torch
import re
from pathlib import Path
from fastapi.templating import Jinja2Templates # UI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

#initialize the FastAPI app
app = FastAPI(title="Text Summarizer App", description="Text Summarization using T5" , version="1.0")

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "Model" / "saved_summary_model"
FRONTEND_DIR = BASE_DIR / "Frontend"

# model & Tokenizer loading
model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, use_fast=True)

# device
if torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

model.to(device)

# templating
templates = Jinja2Templates(directory=FRONTEND_DIR)
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Input schema for dialogue => String
class DialogueInput(BaseModel):
    dialogue: str

def clean_data(text):
    text = re.sub(r"\r\n", " " , text) # remove next line chars
    text = re.sub(r"\s+", " " , text) # replace all types of spaces with " "
    text = re.sub(r"<.*?>", " ", text) # remove html tags 
    text = text.strip().lower()
    return text

def summarize_dialogue(dialogue : str) -> str:
    dialogue = clean_data(dialogue) # clean 

    # tokenize
    inputs = tokenizer(
        dialogue,
        padding="max_length",
        max_length=512,
        truncation=True,
        return_tensors='pt'   # returns pytorch tensors
    ).to(device)
    
    # generate the summary (in the form of token ids)
    model.to(device)
    targets = model.generate(
        input_ids=inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=150,
        num_beams=4,  # Beam search, i.e will generate 4 o/p and return the best one
        early_stopping=True # as soon as we get all the beams we stop
    )
    
    # convert token ids to summary (decoding)
    summary = tokenizer.decode(targets[0], skip_special_tokens=True)
    # skip_special_tokens - skips EOS and seperation tokens (SEP)

    return summary

# API Endpoints
@app.post("/summarize")
async def summarize(dialogue_input: DialogueInput):
    dialogue = dialogue_input.dialogue
    summary = summarize_dialogue(dialogue)
    return {"summary": summary}

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

