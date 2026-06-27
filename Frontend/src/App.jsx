import { useMemo, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const sampleText =
  'Paste a meeting transcript, research note, article excerpt, or customer conversation here. The T5 summarizer will condense the content into a focused summary while preserving the main intent.'

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      {children}
    </svg>
  )
}

function App() {
  const [dialogue, setDialogue] = useState('')
  const [summary, setSummary] = useState('')
  const [mode, setMode] = useState('paragraph')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const wordCount = useMemo(() => {
    return dialogue.trim() ? dialogue.trim().split(/\s+/).length : 0
  }, [dialogue])

  const tokenEstimate = Math.max(0, Math.ceil(wordCount * 1.3))
  const canSummarize = dialogue.trim().length > 0 && status !== 'loading'

  async function generateSummary(event) {
    event.preventDefault()

    if (!dialogue.trim()) return

    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialogue }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary || 'No summary returned.')
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Unable to generate summary.')
      setStatus('error')
    }
  }

  function clearWorkspace() {
    setDialogue('')
    setSummary('')
    setError('')
    setStatus('idle')
  }

  async function copySummary() {
    if (!summary) return
    await navigator.clipboard.writeText(summary)
  }

  const displayedSummary =
    mode === 'bullets' && summary
      ? summary
          .split(/(?<=[.!?])\s+/)
          .filter(Boolean)
          .map((line) => `• ${line}`)
          .join('\n')
      : summary

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#workspace" aria-label="SummarizeAI home">
          <span className="brand-mark">✦</span>
          <span>SummarizeAI</span>
        </a>
        <div className="nav-links">
          <a href="#workspace">Workspace</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#workflow">Workflow</a>
        </div>
        <a className="nav-cta" href="#workspace">Try Now</a>
      </nav>

      <section className="hero-section">
        <span className="status-pill">
          <Icon>
            <path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" />
          </Icon>
          T5 Transformer Workspace
        </span>
        <h1>AI-Powered Text Summarization</h1>
        <p>
          Turn long conversations, articles, and research notes into concise,
          useful summaries with a locally saved transformer model.
        </p>
      </section>

      <section className="workspace-grid" id="workspace" aria-label="Summarization workspace">
        <form className="glass-panel input-panel" onSubmit={generateSummary}>
          {status === 'loading' && <span className="progress-bar" />}

          <div className="panel-heading">
            <div>
              <p className="eyebrow">Source Text</p>
              <h2>Conversation Input</h2>
            </div>
            <div className="panel-actions">
              <button type="button" onClick={() => setDialogue(sampleText)}>
                Load Sample
              </button>
              <button type="button" onClick={clearWorkspace}>
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={dialogue}
            onChange={(event) => setDialogue(event.target.value)}
            placeholder="Paste your dialogue, notes, article, or document content here..."
            aria-label="Text to summarize"
          />

          <div className="panel-footer">
            <div className="metrics" aria-label="Input metrics">
              <span>{tokenEstimate.toLocaleString()} tokens</span>
              <span>{wordCount.toLocaleString()} words</span>
            </div>
            <button className="primary-button" type="submit" disabled={!canSummarize}>
              {status === 'loading' ? 'Generating...' : 'Generate Summary'}
              <Icon>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </Icon>
            </button>
          </div>
        </form>

        <section className="glass-panel output-panel" aria-live="polite">
          {status === 'loading' && <span className="progress-bar" />}

          <div className="panel-heading">
            <div>
              <p className="eyebrow">Model Output</p>
              <h2>Generated Summary</h2>
            </div>
            <div className="segmented-control" aria-label="Summary format">
              <button
                type="button"
                className={mode === 'paragraph' ? 'active' : ''}
                onClick={() => setMode('paragraph')}
              >
                Paragraph
              </button>
              <button
                type="button"
                className={mode === 'bullets' ? 'active' : ''}
                onClick={() => setMode('bullets')}
              >
                Bullets
              </button>
            </div>
          </div>

          <div className={`summary-box ${summary || error ? 'filled' : ''}`}>
            {error ? (
              <p className="error-text">{error}</p>
            ) : displayedSummary ? (
              <p>{displayedSummary}</p>
            ) : (
              <div className="empty-state">
                <Icon>
                  <path d="M7 3h7l5 5v13H7z" />
                  <path d="M14 3v6h5M10 13h6M10 17h4" />
                </Icon>
                <span>Awaiting input signal...</span>
              </div>
            )}
          </div>

          <div className="panel-footer">
            <div className="panel-actions">
              <button type="button" onClick={copySummary} disabled={!summary}>
                Copy
              </button>
            </div>
            <button type="button" className="ghost-action" onClick={generateSummary} disabled={!canSummarize}>
              Regenerate
            </button>
          </div>
        </section>
      </section>

      <section className="tech-strip" aria-label="Technology stack">
        <span>Powered by</span>
        <strong>T5 Transformer</strong>
        <strong>Hugging Face</strong>
        <strong>PyTorch</strong>
        <strong className="healthy">System Ready</strong>
      </section>

      <section className="capabilities" id="capabilities">
        <div className="section-heading">
          <h2>Project Capabilities</h2>
          <p>Built for dialogue-heavy text where fast, readable compression matters.</p>
        </div>
        <div className="card-grid">
          <article>
            <span className="card-icon">文</span>
            <h3>Dialogue Summaries</h3>
            <p>Condenses long conversations into compact summaries of the main points.</p>
          </article>
          <article>
            <span className="card-icon">T5</span>
            <h3>Transformer Model</h3>
            <p>Uses a fine-tuned T5 sequence-to-sequence model saved locally.</p>
          </article>
          <article>
            <span className="card-icon">GPU</span>
            <h3>PyTorch Inference</h3>
            <p>Runs on CUDA when available and falls back to CPU automatically.</p>
          </article>
          <article>
            <span className="card-icon">API</span>
            <h3>FastAPI Endpoint</h3>
            <p>Keeps the backend contract simple with a single `/summarize` route.</p>
          </article>
        </div>
      </section>

      <section className="workflow glass-panel" id="workflow">
        <div>
          <p className="eyebrow">Inference Flow</p>
          <h2>Summarization Pipeline</h2>
          <ol>
            <li>
              <strong>Clean Input</strong>
              <span>Remove noisy whitespace, line breaks, and HTML fragments.</span>
            </li>
            <li>
              <strong>Tokenize</strong>
              <span>Convert text into tensors using the saved tokenizer files.</span>
            </li>
            <li>
              <strong>Generate</strong>
              <span>Use beam search to produce a focused abstractive summary.</span>
            </li>
          </ol>
        </div>
        <img src={heroImg} alt="Abstract neural network visualization" />
      </section>
    </main>
  )
}

export default App
