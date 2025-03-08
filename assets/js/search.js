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
                fields: ["title", "summary", "tags"], // Fields to index
                storeFields: ["title", "summary", "url", "author", "date"], // Fields to store in search results
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
            prefix: true, // Enable prefix search
            fuzzy: 0, // Disable fuzzy search for accuracy
        });

        // Apply additional filter for exact match if query is longer than 3 characters
        if (query.length > 3) {
            results = results.filter((result) =>
                result.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        resultsContainer.innerHTML = "";

        if (results.length > 0) {
            results.forEach((result) => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result");
                resultItem.innerHTML = `
                    <h3 class="text-[#0E4678] text-xl font-heading font-medium mb-1">
                        <a class="text-current" href="${result.url}">${highlightQuery(result.title, query)}</a>
                    </h3>
                    <div class="mb-5">
                        <span class="text-black/60 text-xs font-body">${result.date}</span>
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
});
