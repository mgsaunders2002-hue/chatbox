# Unfinished…
An Unfinished Thought Companion for graduate learning. Version 1 helps the learner discover what she means through one focused question at a time. This is a real model-backed app, not a scripted chatbot. It requires an OpenAI API key before it can respond.

## Run your first version
1. Install Node.js 22 or later, or open this repository in a GitHub Codespace.
2. Copy `.env.example` to `.env`.
3. Put your OpenAI API key after `OPENAI_API_KEY=` in `.env`. Never commit it or paste it into a chat. API use is billed separately by the provider.
4. In the terminal, run `npm start` (no dependency installation required).
5. Open http://localhost:3000. In Codespaces, open the forwarded port 3000 and **keep its visibility Private**.

This prototype binds to localhost and checks request origins. It is intended for personal local use; it is not a public hosting setup. GitHub Pages cannot run the backend. A publicly accessible deployment needs authentication and usage controls first. The repository contains code and instructions only; do not commit API keys, personal conversations, or identifiable classroom information.

## Configuration record
- Initial role: Unfinished Thought Companion.
- Learner-confirmed need: support articulating unfinished ideas during graduate learning.
- Initial pacing and boundaries are proposed starting settings, not yet empirically calibrated preferences.
- Instructions: `instructions-v1.txt`, read by the server on startup and sent with every request.
- Default model: `gpt-4.1-mini`, configurable with `OPENAI_MODEL`; access must be checked with the learner's API account. This is a starting choice, not a claim that it is the newest or best model.
- No tools, autonomous work, browsing, or delegation. No assessed writing or invented personal reflections.
- Each export contains full instructions, their SHA-256 hash, version, requested model, actual returned model for each turn, timestamps, conversation, and learner notes.
- Responses API uses `store: false`; this does not mean the provider has no retention. Review provider policies before sharing sensitive material.

## Rehearse, then revise
Use several real graduate-learning encounters. Export each and privately record: What changed? Did a question steer me? Did support become too much or too little? Keep awkward exchanges.
Only after observing a real issue, preserve v1 and create `instructions-v2.txt`, change the server's instruction filename and version, restart, and use it again. Record the reason for the change and compare similar tasks. No rehearsal outcomes or substantial revision have been invented here.

## Accessibility and acknowledgments
Semantic headings, labelled fields, keyboard controls, visible focus, live status updates, responsive text, no animation, and no dependency on colour alone. Full assistive-technology testing remains to be done. Conversations are held in tab memory; closing or reloading loses them unless exported. Reflection notes are not sent to the model. Exports are JSON text and can be read in a text editor.

Initial code and configuration were developed with ChatGPT at the learner's request. Learner reflections and final design account must be based on her own actual use. Model responses are AI generated and fallible.

API implementation reference: https://developers.openai.com/api/docs/guides/text

## Checks
`npm test` checks input boundaries. Live model behavior requires an API key and purposeful rehearsal; it has not been verified by the automated tests.
