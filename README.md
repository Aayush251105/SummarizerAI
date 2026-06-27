# Text Summarizer App

A local AI text summarization app built with a React + Vite frontend, a FastAPI backend, and a fine-tuned T5 transformer model saved in Hugging Face format.

The application lets users paste conversations, articles, research notes, or document excerpts and generate concise summaries using the local model files in `Model/saved_summary_model`.

## Features

- React workspace UI inspired by a premium dark AI SaaS design.
- FastAPI backend with a stable `POST /summarize` endpoint.
- Local T5 model loading from `Model/saved_summary_model`.
- Text cleaning, tokenization, beam-search generation, and decoding.
- Vite development proxy for frontend-to-backend requests.
- Production build support through FastAPI serving `Frontend/dist`.
- CPU fallback and CUDA support through PyTorch.

## Project Structure

```text
02. Text_Summerizer_App/
|-- Backend/
|   `-- app.py
|-- Frontend/
|   |-- public/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- README.md
|-- Model/
|   |-- Text_Summarizer.ipynb
|   |-- saved_summary_model/
|   |   |-- config.json
|   |   |-- generation_config.json
|   |   |-- model.safetensors
|   |   |-- tokenizer.json
|   |   `-- tokenizer_config.json
|   |-- Dataset/
|   `-- results/
|-- requirements.txt
|-- .gitignore
`-- README.md
```

## How It Works

1. The React frontend provides the summarization workspace.
2. The user enters source text and clicks `Generate Summary`.
3. React sends a JSON request to `POST /summarize`.
4. FastAPI receives the text and passes it to the local T5 pipeline.
5. The backend cleans the text, tokenizes it, generates a summary, decodes it, and returns JSON.
6. React displays the generated summary and allows copy/regenerate actions.

## Backend Setup

Install the Python dependencies from the project root:

```powershell
pip install -r requirements.txt
```

Main backend dependencies:

- `fastapi`
- `uvicorn`
- `transformers`
- `torch`
- `safetensors`

## Frontend Setup

Install frontend dependencies from the `Frontend` folder:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Frontend"
npm install
```

Start the React development server:

```powershell
npm run dev
```

The Vite config proxies `/summarize` to:

```text
http://127.0.0.1:8000
```

So the backend should be running at port `8000` during frontend development.

## Run in Development

Terminal 1, start the backend:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Backend"
uvicorn app:app --reload
```

Terminal 2, start the React frontend:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Frontend"
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Run as a Production Build

Build the React frontend:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Frontend"
npm run build
```

Then start FastAPI:

```powershell
cd "C:\Users\aayus\OneDrive\Desktop\Projects\AI_ML\02. Text_Summerizer_App\Backend"
uvicorn app:app --reload
```

Open:

```text
http://127.0.0.1:8000/
```

FastAPI serves the built React app from `Frontend/dist` and keeps `/summarize` available on the same origin.

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

## Model Files

The app expects the trained model to exist here:

```text
Model/saved_summary_model/
```

Expected files include:

```text
config.json
generation_config.json
model.safetensors
tokenizer.json
tokenizer_config.json
```

The model files are intentionally ignored by Git because they are large local artifacts. Keep them locally, or publish them separately through a model registry if you want to share the project.

## Frontend Design

The React UI follows a dark, glassmorphic AI workspace style:

- Deep charcoal background.
- Transparent glass panels with subtle borders.
- Indigo-to-purple primary actions.
- Compact workspace layout for input and output.
- Responsive stacking for tablets and phones.
- Project-specific content around T5, Hugging Face, PyTorch, and FastAPI.

## Useful Commands

Build frontend:

```powershell
npm run build
```

Lint frontend:

```powershell
npm run lint
```

Run backend from the backend folder:

```powershell
uvicorn app:app --reload
```

Run backend from the project root:

```powershell
uvicorn Backend.app:app --reload
```

## Troubleshooting

If the React app cannot reach the backend, confirm FastAPI is running on:

```text
http://127.0.0.1:8000
```

If `http://127.0.0.1:8000/` says the React build is missing, run `npm run build` inside `Frontend`.

If the model cannot be found, confirm `Model/saved_summary_model` exists and contains the Hugging Face model files.

If summarization is slow, the model is probably running on CPU. The app automatically uses CUDA when `torch.cuda.is_available()` returns `True`.
