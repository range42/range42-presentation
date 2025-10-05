# range42-presentation

Central repository for Range42 project presentations, slides, and talk materials.

## Overview

This repository contains presentation materials for Range42, an open cyber range platform developed by NC3 (National Cybersecurity Competence Center) at the Luxembourg House of Cybersecurity. All presentations are built using LaTeX Beamer with the Metropolis theme.

## Repository Structure

```
range42-presentation/
├── general-oscl2025.tex          # Main presentation: Range42 Status Update
├── images/
│   ├── contribute.png            # QR code for GitHub contributions
│   ├── work-with-us-qrcode.png   # QR code for job applications
│   ├── logos/
│   │   └── FSFE_Public_Money_Public_Code_logo.pdf
│   └── diagrams/
│       └── architecture.png      # Range42 architecture diagram
├── pdf_slides/
│   └── LHC_NC3.pdf              # NC3/LHC branding slides
└── README.md
```

## Presentations

### General OSCL 2025 - Range42 Status Update
**File:** `general-oscl2025.tex`  
**Duration:** 20 minutes  
**Audience:** Open source community, cybersecurity educators, researchers  
**Topics:**
- Range42 platform overview and current achievements
- Architecture and repository structure
- Development tracks and collaboration opportunities
- How to contribute to the project

**Compile:**
```bash
xelatex general-oscl2025.tex
```

## Prerequisites

### System Requirements

- **TeX Distribution:** TeX Live 2020+ or MacTeX 2020+
- **Compiler:** XeLaTeX (required for custom fonts)
- **OS:** Linux, macOS, or Windows with WSL

### Required TeX Packages

Install via `tlmgr`:

```bash
# OSCL Tex dependencies
sudo tlmgr install beamertheme-metropolis fira pgfopts fira plex tcolorbox tikzfill pdfcol fontawesome5 fontspec

# CyCon template needs the following
sudo tlmgr install titlesec enumitem titling preprint
```

### Required Fonts

The presentations use these fonts (must be installed system-wide):

- **IBM Plex Sans** - Primary sans-serif font
- **IBM Plex Mono** - Monospace font for code
- **Fira Sans** - Alternative sans-serif
- **Fira Mono** - Alternative Monospace font

**Installation:**

- **macOS:** `brew install --cask font-ibm-plex font-fira-sans`
- **Linux (Ubuntu/Debian):** 
  ```bash
  sudo apt install fonts-firacode fonts-ibm-plex
  ```
- **Manual:** Download from [IBM Plex](https://github.com/IBM/plex/releases) and [Fira](https://github.com/mozilla/Fira)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/range42/range42-presentation.git
cd range42-presentation
```

### 2. Verify Prerequisites

Check if XeLaTeX is available:

```bash
xelatex --version
```

Check if required fonts are installed:

```bash
fc-list | grep -i "IBM Plex"
fc-list | grep -i "Fira"
```

### 3. Compile a Presentation

```bash
# Compile the main presentation
xelatex general-oscl2025.tex

# If you need speaker notes or bibliography, run multiple times:
xelatex general-oscl2025.tex
xelatex general-oscl2025.tex
```

**Output:** `general-oscl2025.pdf`

### 4. View the PDF

```bash
# macOS
open general-oscl2025.pdf

# Linux
xdg-open general-oscl2025.pdf

# Windows WSL
explorer.exe general-oscl2025.pdf
```

## Customization

### Speaker Notes

Toggle speaker notes by uncommenting one line in the `.tex` file:

```latex
% Show slides only (default)
% \setbeameroption{hide notes}

% Show notes on second screen (for presenting)
% \setbeameroption{show notes}

% Show only notes (for rehearsal)
% \setbeameroption{show only notes}
```

### Color Scheme

The cyber-themed color palette is defined in each `.tex` file:

```latex
\definecolor{cyber-bg}{HTML}{0B0F14}      % Dark background
\definecolor{cyber-ink}{HTML}{E6EEF5}     % Light text
\definecolor{cyber-accent}{HTML}{217EAA}  % Blue accent
\definecolor{cyber-mid}{HTML}{7D9CB7}     % Secondary
\definecolor{cyber-soft}{HTML}{8CA4AC}    % Tertiary
```

Modify these values to change the theme.

## Image Requirements

Presentations require these image files:

| File | Purpose | Format | Source |
|------|---------|--------|--------|
| `images/contribute.png` | GitHub contribution QR code | PNG | Generate from `https://github.com/range42` |
| `images/work-with-us-qrcode.png` | Recruitment QR code | PNG | NC3 careers page |
| `images/logos/FSFE_Public_Money_Public_Code_logo.pdf` | PMPC logo | PDF/Vector | [FSFE Website](https://fsfe.org) |
| `images/diagrams/architecture.png` | Range42 architecture | PNG | Internal docs |
| `pdf_slides/LHC_NC3.pdf` | NC3/LHC branding | PDF | NC3 templates |

**Missing images?** The compilation will fail with clear error messages indicating which files are missing.

## Troubleshooting

### "Font not found" errors

**Problem:** XeLaTeX can't find IBM Plex or Fira fonts.

**Solution:**
1. Verify fonts are installed: `fc-list | grep "IBM Plex"`
2. Rebuild font cache: `fc-cache -fv`
3. Restart your terminal/IDE

### "File not found" for images

**Problem:** Missing image files in `images/` or `pdf_slides/`.

**Solution:**
1. Check the file paths in the error message
2. Ensure all required images are present (see table above)
3. Verify file permissions: `ls -la images/`

### Compilation hangs or errors

**Problem:** XeLaTeX gets stuck or produces cryptic errors.

**Solution:**
1. Delete auxiliary files: `rm *.aux *.log *.nav *.out *.snm *.toc`
2. Try compiling again
3. Check for syntax errors in any recent `.tex` changes

### Package conflicts

**Problem:** TeX Live packages conflict or are outdated.

**Solution:**
```bash
sudo tlmgr update --self
sudo tlmgr update --all
```

## Contributing

### Adding a New Presentation

1. Create a new `.tex` file (e.g., `workshop-2025.tex`)
2. Copy the preamble from `general-oscl2025.tex`
3. Update title, subtitle, date, and content
4. Add entry to this README under "Presentations"
5. Commit and push

### Updating Existing Presentations

1. Edit the `.tex` file
2. Test compilation locally: `xelatex <filename>.tex`
3. Review generated PDF
4. Commit changes with descriptive message
5. Update README if structure/content changes significantly

### Image Guidelines

- **Logos:** Use vector formats (PDF, SVG) when possible
- **Diagrams:** Export at 300 DPI minimum for clarity
- **QR Codes:** Generate at 1000x1000px minimum
- **File size:** Keep images under 2MB each for repository performance

## Best Practices

### Version Control

- Commit compiled PDFs only for releases/archives
- Keep `.gitignore` updated to exclude LaTeX auxiliary files
- Tag presentation versions: `git tag v1.0-oscl2025`

### Presentation Preparation

1. **Rehearse with notes:** Compile with `\setbeameroption{show notes}`
2. **Check timing:** Aim for 1-2 minutes per slide
3. **Test on presentation display:** Colors may differ on projectors
4. **Backup PDF:** Always have a compiled PDF as fallback

### Collaboration

- Use descriptive commit messages: "Add development tracks slide to OSCL presentation"
- Create branches for major revisions: `git checkout -b oscl2025-revision`
- Review changes before presenting: `git diff HEAD~1 <file>.tex`

## License

Presentations and materials are released under **TLP:CLEAR** (Traffic Light Protocol: CLEAR) - Information may be shared freely without restriction.

Individual code examples or technical content may be subject to different licenses as noted in the Range42 project repositories.

## Contact

**Project Lead:** steve.clement@nc3.lu  
**GitHub:** https://github.com/range42  
**Organization:** National Cybersecurity Competence Center (NC3)

## Related Resources

- [Range42 GitHub Organization](https://github.com/range42)
- [NC3 Luxembourg](https://nc3.lu)
- [Luxembourg House of Cybersecurity](https://lhc.lu)
- [Metropolis Beamer Theme Documentation](https://github.com/matze/mtheme)
