# Third-party course text, models, and runtime

## Course text

- *Everyday Conversations: Learning American English*, U.S. Department of State, Bureau of Educational and Cultural Affairs: https://americanenglish.state.gov/resources/everyday-conversations-learning-american-english . The project uses dialogue text only, with independently prepared Simplified Chinese translations. The Department of State copyright page says that, unless copyright is indicated, information on its websites is in the public domain: https://2021-2025.state.gov/copyright-information/ . No U.S. Government seal, logo, cover image, or endorsement is used.
- Mandarin Chinese–English sentence pairs selected by ManyThings from Tatoeba: https://www.manythings.org/anki/ . Sentence pairs are licensed under CC BY 2.0 France: https://creativecommons.org/licenses/by/2.0/fr/ . Each included item retains the English sentence ID and author, the paired Chinese sentence ID and author, attribution text, and direct links to both records. The English source text is retained; the in-app Simplified Chinese prompt is independently reviewed and marked as edited.

The reference English-learning website is not a source of these course texts. See `课程来源与校订说明.md` for the selection and review method.

## Models and runtime

The model cache in this project contains ONNX conversions distributed by their named publishers. Model weights and third-party software retain their own licenses. The reference English-learning website is not a source of these models.

- Kokoro 82M v1.0 ONNX: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX — model card declares Apache-2.0. Base model: https://huggingface.co/hexgrad/Kokoro-82M . Copyright and license text included in MODEL-LICENSE.txt.
- Whisper tiny.en ONNX: https://huggingface.co/Xenova/whisper-tiny.en — conversion model card declares Apache-2.0. Base Whisper: https://github.com/openai/whisper (MIT license; upstream copyright OpenAI). No source website credentials or audio are used.
- kokoro-js 1.2.1: https://www.npmjs.com/package/kokoro-js — runtime and packaged voice assets; license files are preserved by npm installation.
- @huggingface/transformers 3.8.1: https://github.com/huggingface/transformers.js — Apache-2.0; includes ONNX Runtime dependencies under their respective licenses.
- phonemizer and transitive dependencies: see installed package license files and package-lock.json.
- The macOS desktop edition also includes a copy of this computer's Node.js v24.14.1 runtime. Upstream source and bundled third-party license notices: https://github.com/nodejs/node/blob/v24.14.1/LICENSE . The complete runtime license is included in NODE-LICENSE.txt. The desktop launcher is independently implemented using macOS AppKit.

The bundled model cache is unmodified, apart from using the publishers' quantized variants. Generated sample audio is synthesized from the project's own sample sentence.
