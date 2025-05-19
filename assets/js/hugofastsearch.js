/**
 * Simple search index loader using MiniSearch
 */
document.addEventListener("DOMContentLoaded", () => {
    const state = { ready: false, miniSearch: null };

    fetch(`${window.__BASE_URL__}index.json`)
        .then((res) => res.json())
        .then((data) => {
            const docs = data.posts || data;
            state.miniSearch = new MiniSearch({
                fields: ["title", "summary", "content", "tags", "author"],
                storeFields: ["title", "content", "url", "date"],
            });
            state.miniSearch.addAll(docs);
            state.ready = true;
            if (typeof window.hugofastsearch?._onready === "function") {
                window.hugofastsearch._onready();
            }
        })
        .catch((err) => console.error("Failed to load search index", err));

    window.hugofastsearch = {
        isReady() {
            return state.ready;
        },
        search(query) {
            if (!state.ready || !query) return [];
            return state.miniSearch.search(query);
        },
        _onready: null,
    };
});
