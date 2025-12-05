
   const main = document.querySelector(".main");
        const searchInp = document.getElementById("searchInp");
        const searchBtnIcon = document.getElementById("searchBtnIcon");
        const searchContainer = document.querySelector(".search-container");
        const newsDropdownMenu = document.getElementById("newsDropdownMenu");
        const newsDropdownBtn = document.getElementById("newsDropdownBtn");
        const sortDropdown = document.getElementById("sortDropdown");

        // API key - Your fixed key
        const API_KEY = "3eaa2ffe2bf34ab187d98a9c3aaf1d75"; 

        // --- Global variables for state management ---
        let currentQuery = "politics"; 
        let currentSortBy = "publishedAt"; 

        // --- Utility function for Date/Time formatting (Time Ago) ---
        const formatPostDate = (isoDate) => {
            const date = new Date(isoDate);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 5) {
                return "Just now";
            }

            const minutes = Math.floor(diffInSeconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30.44); 
            const years = Math.floor(days / 365.25); 

            if (minutes < 60) {
                return `${minutes} min ago`;
            } else if (hours < 24) {
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (days < 30) {
                return `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (months < 12) {
                return `${months} month${months > 1 ? 's' : ''} ago`;
            } else {
                return `${years} year${years > 1 ? 's' : ''} ago`;
            }
        };

        // --- Function to render news articles ---
        const renderNews = (news) => {
            main.innerHTML = "";
            if (news.length === 0) {
                main.innerHTML = `<p class="text-center w-100 mt-5">No news articles found for "${currentQuery}".</p>`;
                return;
            }

            news.forEach((eachNews) => {
                const formattedDate = formatPostDate(eachNews.publishedAt);
                const author = eachNews.author ? eachNews.author : 'Unknown Author';

                main.innerHTML += `
                    <a class="card m-2" style="width: 18rem;" href="${eachNews.url}" target="_blank">
                        <img src="${eachNews.urlToImage ? eachNews.urlToImage : 'https://via.placeholder.com/400x200?text=No+Image'}" class="card-img-top" alt="News Image">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${eachNews.title}</h5>
                            <p class="card-text">${eachNews.description ? eachNews.description.substring(0, 100) + '...' : 'No description available.'}</p>
                            <div class="mt-auto">
                                <small><strong>Author:</strong> ${author.length > 25 ? author.substring(0, 25) + '...' : author}</small>
                                <small>${formattedDate}</small>
                            </div>
                        </div>
                    </a>
                `;
            });
        }

        // --- Function to fetch and display news (Initial/Category/Sort) ---
        const getNews = async (category = currentQuery, sortBy = currentSortBy) => {
            currentQuery = category;
            currentSortBy = sortBy;

            main.innerHTML = `<div class="text-center w-100 mt-5"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p class="mt-2">Loading news...</p></div>`;

            try {
                let url;
                if (category === "politics") { 
                    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
                } else if (category === "us" || category === "africa" || category === "asia") {
                    const countryCode = category === "us" ? "us" : category === "asia" ? "in" : "za";
                    url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${API_KEY}`;
                } else {
                    url = `https://newsapi.org/v2/everything?q=${category}&sortBy=${sortBy}&apiKey=${API_KEY}`;
                }
                
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`API call failed: ${res.statusText}. Status: ${res.status}`);
                }
                const data = await res.json();
                renderNews(data.articles);
            } catch (error) {
                console.error("Error fetching news:", error);
                main.innerHTML = `<p class="text-center w-100 mt-5 text-danger">Failed to load news: ${error.message}. Please check your API key and network connection.</p>`;
            }
        }

        // --- Function to fetch searched news (Search/Sort) ---
        const getSearchedNews = async (query, sortBy = currentSortBy) => {
            if (!query.trim()) {
                getNews('politics', 'publishedAt'); 
                return; 
            }

            currentQuery = query;
            currentSortBy = sortBy;

            main.innerHTML = `<div class="text-center w-100 mt-5"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p class="mt-2">Searching for "${query}"...</p></div>`;
            
            try {
                const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=${sortBy}&apiKey=${API_KEY}`;
                
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`API call failed: ${res.statusText}. Status: ${res.status}`);
                }
                const data = await res.json();
                renderNews(data.articles);
            } catch (error) {
                console.error("Error fetching searched news:", error);
                main.innerHTML = `<p class="text-center w-100 mt-5 text-danger">Failed to load search results: ${error.message}.</p>`;
            }
        }

        // --- EVENT LISTENERS ---

        // Search Input Hide/Show and Search Action
        searchBtnIcon.addEventListener("click", () => {
            const isVisible = searchInp.classList.contains("search-input-visible");

            if (isVisible) {
                if (searchInp.value.trim() !== "") {
                    getSearchedNews(searchInp.value, currentSortBy);
                }
            } 
            
            searchInp.classList.toggle("search-input-hidden");
            searchInp.classList.toggle("search-input-visible");

            if (searchInp.classList.contains("search-input-visible")) {
                searchInp.focus();
            } else {
                searchInp.value = "";
            }
        });

        // Hide search input when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInside = searchContainer.contains(event.target);
            const isInputVisible = searchInp.classList.contains("search-input-visible");

            if (!isClickInside && isInputVisible) {
                searchInp.classList.remove("search-input-visible");
                searchInp.classList.add("search-input-hidden");
                searchInp.value = ""; 
            }
        });

        // Search functionality on Enter key press
        searchInp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                getSearchedNews(searchInp.value, currentSortBy);
                searchInp.classList.remove("search-input-visible");
                searchInp.classList.add("search-input-hidden");
            }
        });

        // News Dropdown (Category) Logic
        newsDropdownMenu.addEventListener("click", (e) => {
            e.preventDefault();
            const selectedItem = e.target;
            if (selectedItem.classList.contains('dropdown-item')) {
                const selectedCategory = selectedItem.getAttribute('data-value');
                newsDropdownBtn.textContent = selectedItem.textContent;
                sortDropdown.value = 'publishedAt';
                currentSortBy = 'publishedAt'; 
                getNews(selectedCategory, currentSortBy); 
            }
        });

        // Sort Functionality Logic
        sortDropdown.addEventListener("change", (e) => {
            currentSortBy = e.target.value;
            const categories = ['politics', 'us', 'africa', 'asia'];
            if (categories.includes(currentQuery)) {
                getNews(currentQuery, currentSortBy); 
            } else {
                getSearchedNews(currentQuery, currentSortBy);
            }
        });

        // Mobile Menu Toggle
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        menuBtn.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        // Initial Load
        document.addEventListener('DOMContentLoaded', () => {
            getNews();
        });
