IMAGE := range42-xelatex
TEX   := range42-overview-2026-11.tex
BASE  := $(basename $(TEX))
ROOT  := $(shell git rev-parse --show-toplevel)
REL   := $(shell git rev-parse --show-prefix)

# Repo is mounted read-only (the .tex uses ../../../ paths); only this folder is writable.
DOCKER_RUN := docker run --rm --network none \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp \
	-v $(ROOT):/work:ro -v $(CURDIR):/work/$(REL) \
	-w /work/$(REL) $(IMAGE)

# $(1) = output name, $(2) = preamble code injected before \begin{document}.
# Two passes for cross-references and the Beamer navigation; log tail shown on failure.
xelatex = $(DOCKER_RUN) sh -c 'for i in 1 2; do \
	xelatex -interaction=nonstopmode -halt-on-error -jobname=$(1) \
	"\AddToHook{begindocument/before}{$(2)}\input{$(TEX)}" >/dev/null \
	|| { tail -20 $(1).log; exit 1; }; done'

.PHONY: all pdf notes-dual notes-only image clean
.NOTPARALLEL:

all: pdf notes-dual notes-only

pdf: image
	$(call xelatex,$(BASE),)
	@$(MAKE) --no-print-directory clean

notes-dual: image
	$(call xelatex,$(BASE)-notes-dual,\setbeameroption{show notes on second screen=right})
	@$(MAKE) --no-print-directory clean

notes-only: image
	$(call xelatex,$(BASE)-notes-only,\setbeameroption{show only notes})
	@$(MAKE) --no-print-directory clean

image:
	docker build -q -t $(IMAGE) .

clean:
	rm -f $(foreach e,aux log nav out snm toc vrb,$(BASE)*.$(e))
