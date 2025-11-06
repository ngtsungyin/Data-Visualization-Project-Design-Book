# Data-Visualization-Project-Design-Book
COS30045 Data Visualization Group Assignment

## Setup (index.html and folders)
One team member should create the basic file structure and push it to the `main` branch as the initial commit:

Required files/folders:
- index.html (project entry)
- js/ (JavaScript files)
- css/ (styles)
- data/ (CSV/JSON data)
- assets/ (images, icons)

Example commands (run from the project root):
```powershell
# create folders and files (Windows PowerShell example)
mkdir js css data assets
ni index.html
ni js\main.js
ni css\styles.css
ni data\README.md
ni assets\README.md

# git initial commit
git add .
git commit -m "chore: initial project structure and index.html"
git push origin main
```

Minimal index.html should link `css/styles.css` and `js/main.js`.

## Getting organised (plan)
Create a short task list and assign branches:

Example task table:
- Load data for bar chart — feature/loaddata-barchart — Tsung Yin
- Set up home page for site — feature/homepage — Elisa
- Create color palette & sketches — feature/design-palette — Elyn

Keep this list updated in the README or a project board.

## Create a branch for a feature
Each team member:
- Create a branch (e.g., `git checkout -b feature/loaddata-barchart`)
- Make changes, commit, push to remote
- Open a PR targeting `main`

## Pull requests, review, merge
- Team Member A opens PR, assigns reviewer
- Reviewer tests, requests changes or approves
- Merge to `main`
- Repeat with Team Member B

Notes:
- If you encounter a merge conflict, resolve locally and push the fixed branch.
- Include a short description in PRs explaining intent and files changed.
