// Function to initialize the HTML structure
const initializePage = () => {
  const body = document.querySelector('body');
  
  // Create the HTML structure
  const section = document.createElement('section');
  section.classList.add('wiki');
  
  const container = document.createElement('div');
  container.classList.add('container');
  
  const logoImg = document.createElement('img');
  logoImg.src = './wiki-logo.png';
  logoImg.alt = 'logo';
  
  const heading = document.createElement('h3');
  heading.textContent = 'Search Wikipedia';
  
  const form = document.createElement('form');
  form.classList.add('form');
  
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('form-input');
  
  const button = document.createElement('button');
  button.type = 'submit';
  button.classList.add('submit-btn');
  button.textContent = 'Search';
  
  form.appendChild(input);
  form.appendChild(button);
  
  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('results');
  
  const searchHistory = document.createElement('div');
  searchHistory.classList.add('search-history');
  searchHistory.innerHTML = '<h4>Search History</h4><ul></ul>';
  
  const popularSearches = document.createElement('div');
  popularSearches.classList.add('popular-searches');
  popularSearches.innerHTML = '<h4>Popular Searches</h4><ul></ul>';
  
  const languageSelect = document.createElement('select');
  languageSelect.classList.add('language-select');
  languageSelect.innerHTML = `
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
    <option value="pt">Portuguese</option>
    <option value="ar">Arabic</option>
    <option value="ur">Urdu</option>
  `;
  
  container.appendChild(logoImg);
  container.appendChild(heading);
  container.appendChild(form);
  container.appendChild(searchHistory);
  container.appendChild(popularSearches);
  container.appendChild(languageSelect);
  
  section.appendChild(container);
  section.appendChild(resultsDiv);
  
  body.appendChild(section);
};

// Initialize the page
initializePage();

// Variables for form, results, and language select
const formDOM = document.querySelector('.form');
const inputDOM = document.querySelector('.form-input');
const resultsDOM = document.querySelector('.results');
const searchHistoryList = document.querySelector('.search-history ul');
const popularSearchesList = document.querySelector('.popular-searches ul');
const languageSelect = document.querySelector('.language-select');

// Search history storage
const searchHistory = new Set();

// Add event listener to the form
formDOM.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = inputDOM.value;
  const language = languageSelect.value;
  if (!value) {
    resultsDOM.innerHTML = '<div class="error">Please enter a valid search term.</div>';
    return;
  }

  // Add search to history
  if (!searchHistory.has(value)) {
    searchHistory.add(value);
    const li = document.createElement('li');
    li.textContent = value;
    li.addEventListener('click', () => {
      inputDOM.value = value;
      fetchPages(value, language);
    });
    searchHistoryList.appendChild(li);
  }

  fetchPages(value, language);
});

// Function to fetch pages
const fetchPages = async (searchValue, language) => {
  resultsDOM.innerHTML = '<div class="loading"></div>';
  try {
    const response = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=${searchValue}`);
    const data = await response.json();
    const results = data.query.search;
    if (results.length < 1) {
      resultsDOM.innerHTML = '<div class="error">No matching results were found. Please try again.</div>';
      return;
    }
    renderResults(results, searchValue);
  } catch (error) {
    resultsDOM.innerHTML = '<div class="error">There was an error...</div>';
  }
};

// Function to render results
const renderResults = (list, searchValue) => {
  const cardsList = list
    .map((item) => {
      const { title, snippet, pageid } = item;
      const highlightedSnippet = snippet.replace(
        new RegExp(searchValue, 'gi'),
        match => `<span class="highlight">${match}</span>`
      );
      return `<a href="https://en.wikipedia.org/?curid=${pageid}" target="_blank">
            <h4>${title}</h4>
            <p>${highlightedSnippet}</p>
          </a>`;
    })
    .join('');
  resultsDOM.innerHTML = `<div class="articles">${cardsList}</div>`;
};

// Function to fetch search suggestions from Wikipedia
const fetchSearchSuggestions = async (query) => {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=5&format=json&origin=*`);
    const data = await response.json();
    return data[1]; // data[1] contains the search suggestions
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return []; // Return an empty array in case of an error
  }
};

// Function to initialize additional features
const initializeFeatures = async () => {
  // Fetch and render search suggestions for a generic query (e.g., "Technology")
  const searchSuggestions = await fetchSearchSuggestions('Technology');
  searchSuggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.textContent = suggestion;
    li.addEventListener('click', () => {
      inputDOM.value = suggestion;
      fetchPages(suggestion, languageSelect.value);
    });
    popularSearchesList.appendChild(li);
  });
};

// Initialize features after page load
window.addEventListener('load', () => {
  initializeFeatures();
});
