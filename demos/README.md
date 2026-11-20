# Live demos

| Demo | Where it runs | Source |
|---|---|---|
| Fake News Detection | this site, [`/fake-news/`](../fake-news/) (in the browser, no server) | [Fake-News-Detection-System](https://github.com/exotic-Siddharth/Fake-News-Detection-System) |
| rag-eval-lab | this site, [`/rag-eval-lab/`](../rag-eval-lab/) (in the browser, no server), built by [`ml-demos.yml`](../.github/workflows/ml-demos.yml) | [rag-eval-lab](https://github.com/exotic-Siddharth/rag-eval-lab) |

`ml-demos.yml` exports the passages and the Python pipeline's results from the project repo, embeds the
passages with the same ONNX model the page uses, checks the JavaScript port against the Python pipeline on
200 held-out questions, and only then publishes the page. Editing anything in this folder re-runs it.
