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
  
 
  container.appendChild(logoImg);
  container.appendChild(heading);
  container.appendChild(form);
  
  section.appendChild(container);
  section.appendChild(resultsDiv);
  
  body.appendChild(section);
};

// Call the initialization function to set up the page
initializePage();

// JavaScript code for handling the form submission and fetching data
const url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

const formDOM = document.querySelector('.form');
const inputDOM = document.querySelector('.form-input');
const resultsDOM = document.querySelector('.results');

formDOM.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = inputDOM.value;
  if (!value) {
    resultsDOM.innerHTML =
      '<div class="error"> Please enter a valid search term.</div>';
    return;
  }
  fetchPages(value);
});

const fetchPages = async (searchValue) => {
  resultsDOM.innerHTML = '<div class="loading"></div>';
  try {
    const response = await fetch(`${url}${searchValue}`);
    const data = await response.json();
    const results = data.query.search;
    if (results.length < 1) {
      resultsDOM.innerHTML =
        '<div class="error"> No matching results were found. Please try again.</div>';
      return;
    }
    renderResults(results);
  } catch (error) {
    resultsDOM.innerHTML = '<div class="error"> There was an error...</div>';
  }
};

const renderResults = (list) => {
  const cardsList = list
    .map((item) => {
      const { title, snippet, pageid } = item;
      return `<a href="http://en.wikipedia.org/?curid=${pageid}" target="_blank">
            <h4>${title}</h4>
            <p>
              ${snippet}
            </p>
          </a>`;
    })
    .join('');
  resultsDOM.innerHTML = `<div class="articles">
          ${cardsList}
        </div>`;
};
