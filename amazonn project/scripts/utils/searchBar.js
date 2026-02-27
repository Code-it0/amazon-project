export function bindSearchBar() {
const searchBar = document.querySelector('.js-search-bar');
  searchBar.addEventListener('keydown', (event) => {
    // Check if the key pressed was 'Enter'
    if (event.key === 'Enter') {
      const searchTerm = searchBar.value.trim(); // .trim() removes spaces from start/end

      // Only run if the search term is NOT empty
      if (searchTerm !== '') {
        // 1. Simple redirect (per your request)
        // window.location.href = `amazon.html?search='${searchTerm}`; could cause error if user eneterd special characters like & / = 

        // 2. OR: If you want to actually pass the search text to the new page:
        window.location.href = `amazon.html?search=${encodeURIComponent(searchTerm)}`;
      }
    }
  });
}


