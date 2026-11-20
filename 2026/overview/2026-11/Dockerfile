# XeLaTeX build environment for the Range42 Beamer decks.
# Pinned by digest (texlive/texlive:latest, built 2026-11-15) for reproducible builds.
FROM texlive/texlive:latest@sha256:c21636aa13e86716d15dab4e352356cb0d34f9365d6091db066e5df71041d67b

# XeTeX finds fonts by name through fontconfig, which does not index the
# TeX Live font tree by default (needed for IBM Plex / Fira).
RUN ln -s "$(kpsewhich -var-value TEXMFDIST)/fonts/opentype" /usr/local/share/fonts/texlive-opentype \
 && fc-cache -f
