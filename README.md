# Text Summarizer App

A local text summarization web app built with FastAPI, a small HTML/CSS frontend, and a fine-tuned T5 model saved in Hugging Face format.

The app loads model weights from `Model/saved_summary_model` and exposes a browser UI where users can paste text or dialogue and receive a generated summary.

## Features

- FastAPI backend with a `/summarize` JSON endpoint.
- Simple browser frontend served from FastAPI.
- Local T5 model loading from `Model/saved_summary_model`.
- Text cleanup before inference.
- CPU and CUDA support through PyTorch.

## Project Structure

```text
02. Text_Summerizer_App/
├── Backend/
│   └── app.py
├── Frontend/
│   ├── index.html
│   └── style.css
├── Model/
│   ├── Text_Summarizer.ipynb
│   ├── saved_summary_model/
│   │   ├── config.json
│   │   ├── generation_config.json
│   │   ├── model.safetensors
│   │   ├── tokenizer.json
│   │   └── tokenizer_config.json
│   ├── Dataset/
│   └── results/
├── requirements.txt
├── .gitignore
└── README.md
```

## How It Works

1. `Backend/app.py` starts a FastAPI application.
2. The backend loads the tokenizer and model from `Model/saved_summary_model`.
3. The home route `/` serves `Frontend/index.html`.
4. The frontend sends text to the `/summarize` endpoint using `fetch`.
5. The backend cleans the text, tokenizes it, runs T5 generation, decodes the output, and returns the summary as JSON.

## Requirements

Install the required Python packages:

```powershell
pip install -r requirements.txt
```

Main dependencies:

- `fastapi`
- `uvicorn`
- `transformers`
- `torch`
- `safetensors`

## Model Files

The app expects the trained model to exist here:

```text
Model/saved_summary_model/
```

That folder should contain files such as:

```text
config.json
generation_config.json
model.safetensors
tokenizer.json
tokenizer_config.json
```

Model files are ignored by Git because they are large local artifacts. Keep them locally, or upload them to a model registry such as Hugging Face Hub if you want to share the project without committing weights.

## Run the App

From the backend folder:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Backend"
uvicorn app:app --reload
```

Then open:

```text
http://127.0.0.1:8000/
```

You can also run from the project root:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App"
uvicorn Backend.app:app --reload
```

## API Usage

Endpoint:

```text
POST /summarize
```

Request body:

```json
{
  "dialogue": "Paste the text or dialogue to summarize here."
}
```

Response:

```json
{
  "summary": "Generated summary text."
}
```

## Backend Overview

The backend uses these main pieces:

- `FastAPI` for the web server and API route.
- `Jinja2Templates` to serve the HTML page.
- `StaticFiles` to serve frontend CSS.
- `AutoTokenizer` and `T5ForConditionalGeneration` to load the saved T5 summarizer.
- `torch` to run inference on GPU if available, otherwise CPU.

## Frontend Overview

The frontend contains:

- A textarea for entering text.
- A submit button.
- A summary output area.
- JavaScript that sends the textarea content to `/summarize` and displays the response.

## Troubleshooting

If `/` gives a 500 error, check the terminal traceback first. Template errors usually come from the frontend path or the FastAPI/Starlette template response signature.

If the app says the model cannot be found, confirm that `Model/saved_summary_model` exists and contains the saved Hugging Face model files.

If `uvicorn` is not recognized, run it through Python:

```powershell
python -m uvicorn app:app --reload
```

If you run from the project root, use:

```powershell
python -m uvicorn Backend.app:app --reload
```

If summarization is slow, the model is probably running on CPU. The app automatically uses CUDA when `torch.cuda.is_available()` returns `True`.
