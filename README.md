# Appadurai M — Portfolio

A one-page portfolio built with a Flask backend and a hand-built HTML/CSS/JS
frontend. The hero includes a small "live query" console that types out real
skills data — the rest of the page reads like structured records (a skills
table, an experience/education ledger, project rows) rather than a generic
template.

## Project structure

```
portfolio/
  app.py                  Flask app: serves the page, contact API, resume download
  requirements.txt
  templates/
    index.html
  static/
    css/style.css
    js/script.js
    assets/Appadurai_M_Resume.pdf
  data/
    messages.json          created automatically — stores contact form submissions
```

## Run it locally

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000

## Deploy

**Render (recommended — you already list it on your resume):**
1. Push this folder to a GitHub repo.
2. On Render, create a new Web Service from that repo.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Render sets the `PORT` environment variable automatically — `app.py` already reads it.

**Note on GitHub Pages:** GitHub Pages only serves static files, it can't run
Python. If you want the site on GitHub Pages instead, deploy the contents of
`templates/index.html` + `static/` as plain static files, but the contact
form's `/api/contact` endpoint won't work there since it needs the Flask
server — either point the form at a hosted backend (Render, Railway) or
swap it for a static form service (e.g. Formspree).

## Customizing

- Swap `static/assets/Appadurai_M_Resume.pdf` for an updated resume file — the
  filename must stay the same, or update the path in `app.py`'s `/resume` route.
- Contact messages are appended to `data/messages.json`. For production, wire
  `app.py`'s `contact()` view to an email service (e.g. SendGrid, SMTP) instead.
- Update the `PROFILE` dict in `app.py` and the content in `templates/index.html`
  as your experience and projects grow.
