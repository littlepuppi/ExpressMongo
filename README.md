# ExpressMongo

This repository is named ExpressMongo, but it does not contain an Express.js or MongoDB application. The only project folder is `linkedin-resume-agent/`, which is a LinkedIn Resume Agent (the same project also lives in the [linkedin-resume-agent](https://github.com/littlepuppi/linkedin-resume-agent) repository).

The agent takes a user profile and a job description, extracts keywords, and generates a tailored resume as text, JSON, and (in the JavaScript version) a Word document.

## Features

- Keyword extraction from a job description (technical and soft-skill lists)
- Tailored summary and experience text
- Output as plain text and JSON
- JavaScript version can also write a `.docx` file (`docx` package)

The job description and profile path are currently hard-coded in the scripts; edit those values before running.

## Tech stack

- JavaScript (Node.js) with the `docx` package
- Python 3 (standard library only: dataclasses, json, re)

## Getting started

All commands below are run from the `linkedin-resume-agent/` folder.

### JavaScript

```bash
cd linkedin-resume-agent
npm install
npm start
```

`npm start` and `npm run dev` both run `node linkedinResumeAgent.js`. The script loads a profile from a local JSON file and writes text, JSON, and Word output files in the same folder.

### Python

```bash
cd linkedin-resume-agent
python linkedin_resume_agent.py
# or
python my_resume.py
```

No third-party Python packages are required.

## Note

This looks like a second copy of the resume agent under a different repo name. Consider renaming this repository, adding a real Express/Mongo project, or keeping a single canonical repo. The folder also includes sample profile and output files; be careful about committing personal contact details in a public repository.
