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

Example:
Create a short task list and assign branches. We have 3 members — split tasks so work doesn’t overlap:

Team members and tasks:
- Tsung Yin — feature/data-load-tsung
  - Load and preprocess datasets (CSV/JSON) for bar/line charts
  - Add sample data to /data and write loader in js/data-loader.js
- Elisa — feature/homepage-elisa
  - Build homepage layout, navigation, and chart placeholders in index.html
  - Implement basic CSS in css/styles.css and wire up js/main.js
- Elyn — feature/visuals-elyn
  - Design chart components and palettes; implement initial D3/Chart.js modules in js/charts.js
  - Create simple prototypes in /assets for icons/images

Keep this list updated in the README or a project board.

## Branch workflow and rules (avoid accidental deletion)
Follow these rules so no one accidentally deletes or overwrites others' work:

1. Branch from main for every task
   - Naming convention: feature/<short-task>-<owner>
   - Examples:
     - feature/data-load-tsung yin
     - feature/homepage-elisa
     - feature/visuals-elyn

2. Create and push a branch (local example)
```bash
# start from an up-to-date main
git checkout main
git pull origin main

# create feature branch
git checkout -b feature/homepage-elisa

# work, commit, then push
git push -u origin feature/homepage-elisa
```

3. Open a Pull Request (PR) to merge into main
   - Add a clear title and description
   - Assign at least one reviewer (another team member)
   - Do not merge your own branch without approval (use the reviewer workflow)

4. Protect the main branch (admin steps on GitHub)
   - Repository > Settings > Branches > Add branch protection rule for "main"
     - Require pull request reviews before merging (1 or 2 reviewers)
     - Require status checks to pass before merging (CI/lint if used)
     - Include admins (optional)
     - Disable "Allow force pushes" and "Allow deletions" for main
     - Consider "Restrict who can push" (only maintainers)

5. Avoid destructive actions
   - Do not force-push (git push --force) to shared branches
   - If you need to update a merged branch, create a new branch and PR
   - If a branch is accidentally deleted on remote, restore it:
```bash
# if branch deleted remotely but you still have it locally
git push -u origin feature/name

# if deleted and not local, recreate from main then push
git checkout main
git pull origin main
git checkout -b feature/name
git push -u origin feature/name
```

6. Merge and cleanup
   - After PR approval and merge, delete the remote branch (GitHub button) — only after consensus
   - Locally remove merged branches:
```bash
git fetch --prune
git branch -d feature/homepage-elisa
```

Notes:
- Keep commits small and focused; write clear PR descriptions.
- Communicate in issues/PR comments or your team chat before removing branches or making big refactors.
- If a merge conflict occurs, resolve it locally against main, test, then push and update the PR.
