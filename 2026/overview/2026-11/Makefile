IMAGE := range42-xelatex
LANGS := en fr
BASE  := range42-overview-2026-11
ROOT  := $(shell git rev-parse --show-toplevel)
REL   := $(shell git rev-parse --show-prefix)

# Repo is mounted read-only. The language folder is mounted read-write in place of this folder,
# so the .tex keeps its ../../../ image paths and finds its own slides PDF for the notes thumbnails.
# $(1) = language folder.
docker_run = docker run --rm --network none \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp \
	-v $(ROOT):/work:ro -v $(CURDIR)/$(1):/work/$(REL) \
	-w /work/$(REL) $(IMAGE)

# $(1) = language folder, $(2) = output name, $(3) = preamble code injected before \begin{document}.
# Two passes for cross-references and the Beamer navigation; log tail shown on failure.
xelatex = $(call docker_run,$(1)) sh -c 'for i in 1 2; do \
	xelatex -interaction=nonstopmode -halt-on-error -jobname=$(2) \
	"\AddToHook{begindocument/before}{$(3)}\input{$(BASE).tex}" >/dev/null \
	|| { tail -20 $(2).log; exit 1; }; done'

.PHONY: all $(LANGS) image clean
.NOTPARALLEL:

all: $(LANGS)

# Slides, slides + notes on a second screen, notes only. PDFs are written to the language folder.
$(LANGS): image
	$(call xelatex,$@,$(BASE),)
	$(call xelatex,$@,$(BASE)-notes-dual,\setbeameroption{show notes on second screen=right})
	$(call xelatex,$@,$(BASE)-notes-only,\setbeameroption{show only notes})
	@$(MAKE) --no-print-directory clean

image:
	docker build -q -t $(IMAGE) .

clean:
	rm -f $(foreach l,$(LANGS),$(foreach e,aux log nav out snm toc vrb,$(l)/$(BASE)*.$(e)))
