// Search functionality using HugoFastSearch
// Keeps existing DOM structure with .search-input elements and .search-results containers

document.addEventListener("DOMContentLoaded", () => {
    const searchInputs = document.querySelectorAll(".search-input");
    const resultsContainers = document.querySelectorAll(".search-results");

    if (!searchInputs.length || !resultsContainers.length) {
        console.error("Search inputs or results containers not found!");
        return;
    }

    function initSearch() {
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get("query");

        searchInputs.forEach((input, idx) => {
            const container = resultsContainers[idx] || resultsContainers[0];
            if (initialQuery) {
                input.value = initialQuery;
                performSearch(initialQuery, container);
            }

            input.addEventListener("input", () => {
                const q = input.value.trim();
                performSearch(q, container);
            });
        });
    }

    if (window.hugofastsearch && window.hugofastsearch.isReady()) {
        initSearch();
    } else if (window.hugofastsearch) {
        window.hugofastsearch._onready = initSearch;
    }

    function performSearch(query, container) {
        if (!window.hugofastsearch || !window.hugofastsearch.isReady()) {
            container.innerHTML = '<p class="text-gray-600">Search is not ready yet. Please wait...</p>';
            return;
        }

        if (query.length < 2) {
            container.innerHTML = '<p class="text-gray-600">Please enter at least 2 characters to search.</p>';
            return;
        }

        const results = window.hugofastsearch.search(query.toLowerCase());
        container.innerHTML = "";

        if (results.length > 0) {
            for (const result of results) {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result-item");
                const snippet = createSnippet(result.content || "", query);
                const title = result.title || "";
                const date = result.date || "";
                resultItem.innerHTML = `
                    <h3 class="text-primary text-xl font-heading font-medium mb-1">
                        <a class="text-current" href="${result.url}">${highlightQuery(title, query)}</a>
                    </h3>
                    <p class="text-sm mb-2">${snippet}</p>
                    <div class="mb-2">
                        <span class="text-black/60 text-xs font-body">${date}</span>
                    </div>
                `;
                container.appendChild(resultItem);
            }
        } else {
            container.innerHTML = "<p>No results found.</p>";
        }
    }

    function highlightQuery(text, query) {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escapedQuery})`, "gi");
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function createSnippet(text, term) {
        if (!text) return "";
        const lowerText = text.toLowerCase();
        const lowerTerm = term.toLowerCase();
        const index = lowerText.indexOf(lowerTerm);
        if (index === -1) {
            return text.substring(0, 150) + "...";
        }
        const start = Math.max(0, index - 75);
        const end = Math.min(text.length, index + 75);
        const snippet = text.substring(start, end);
        return highlightQuery(snippet, term) + "...";
    }
});
