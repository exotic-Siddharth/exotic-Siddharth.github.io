# Live demos

| Demo | Where it runs | Source |
|---|---|---|
| Fake News Detection | this site, [`/fake-news/`](../fake-news/) (in the browser, no server) | [Fake-News-Detection-System](https://github.com/exotic-Siddharth/Fake-News-Detection-System) |
| rag-eval-lab | Hugging Face Space, deployed by [`ml-demos.yml`](../.github/workflows/ml-demos.yml) | [rag-eval-lab](https://github.com/exotic-Siddharth/rag-eval-lab) |

`ml-demos.yml` builds each Space image on GitHub Actions, smoke-tests it on 2 CPUs (the size of a free
Space), checks that its retrieval matches the evaluated Recall@1, and only then uploads it to Hugging Face. It needs a repository secret `HF_TOKEN` with write access.
Editing anything in this folder re-runs it.
