document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const clearInput = document.getElementById("clear-input");
    const resultsContainer = document.getElementById("search-results");

    if (!searchInput || !clearInput || !resultsContainer) {
        console.error("Search input, clear button, or results container not found!");
        return;
    }

    let miniSearch;

    // Fetch JSON and initialize MiniSearch
    fetch("/index.json")
        .then((response) => response.json())
        .then((data) => {
            const posts = data.posts;

            miniSearch = new MiniSearch({
                fields: ["title", "content", "tags"], // Fields to index
                storeFields: ["title", "summary", "content", "url", "author", "date"], // Fields to store in search results
                tokenize: (text) => {
                    return text
                        .toLowerCase()
                        .split(/[\s,]+/)
                        .map((token) => token.trim());
                },
            });

            miniSearch.addAll(posts);

            // Handle URL query parameter
            const params = new URLSearchParams(window.location.search);
            const query = params.get("query");
            if (query) {
                searchInput.value = query;
                performSearch(query);
            }
        })
        .catch((error) => console.error("Error loading JSON data:", error));

    // Handle input changes
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        toggleClearButton(query);
        performSearch(query);
    });

    // Clear input on button click
    clearInput.addEventListener("click", () => {
        searchInput.value = "";
        toggleClearButton("");
        resultsContainer.innerHTML = '<p class="text-gray-600">Please enter a search query.</p>';
    });

    // Show/hide the clear button
    function toggleClearButton(query) {
        if (query) {
            clearInput.classList.remove("hidden");
        } else {
            clearInput.classList.add("hidden");
        }
    }

    function performSearch(query) {
        if (!miniSearch) {
            resultsContainer.innerHTML = '<p class="text-gray-600">Search is not ready yet. Please wait...</p>';
            return;
        }

        if (query.length < 2) {
            resultsContainer.innerHTML = '<p class="text-gray-600">Please enter at least 2 characters to search.</p>';
            return;
        }

        // Perform basic search with prefix matching
        let results = miniSearch.search(query.toLowerCase(), {
            prefix: true,
            fuzzy: 0.2,
        });

        resultsContainer.innerHTML = "";

        if (results.length > 0) {
            results.forEach((result) => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result-item");
                const snippet = createSnippet(result.content, query);
                resultItem.innerHTML = `
                    <h3 class="text-primary text-xl font-heading font-medium mb-1">
                        <a class="text-current" href="${result.url}">${highlightQuery(result.title, query)}</a>
                    </h3>
                    <p class="text-sm mb-2">${snippet}</p>
                    <div class="mb-2">
                        <span class="text-black/60 text-xs font-body">${result.date || ""}</span>
                    </div>
                `;
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = "<p>No results found.</p>";
        }
    }

    function highlightQuery(text, query) {
        if (!query) return text; // Prevent errors if query is empty
        const regex = new RegExp(`(${query})`, "gi");
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
