// Add an event listener for the DOMContentLoaded event to run the function when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () { 
    // Get the base currency select element
    const baseCurrencySelect = document.getElementById('base-currency'); 
    // Get the target currency select element
    const targetCurrencySelect = document.getElementById('target-currency'); 
    // Get the amount input element
    const amountInput = document.getElementById('amount'); 
    // Get the span element to display the converted amount
    const convertedAmountSpan = document.getElementById('converted-amount'); 
    // Get the button element for fetching historical rates
    const historicalRatesBtn = document.getElementById('historical-rates'); 
    // Get the container element for displaying historical rates
    const historicalRatesContainer = document.getElementById('historical-rates-container'); 
    // Get the input element for selecting a historical date
    const historicalDateInput = document.getElementById('historical-date'); 
    // Get the button element for saving favorite currency pairs
    const saveFavoriteBtn = document.getElementById('save-favorite'); 
    // Get the container element for displaying favorite currency pairs
    const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs'); 

    // Define the API key for accessing the currency API
    const apiKey = 'fca_live_ZOGTfTQyfhUJZIo7g114IDshDLPZj1Tck5EySkxk'; 
    // Define the URL for fetching the latest exchange rates
    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest'; 
    // Define the URL for fetching historical exchange rates
    const historicalApiUrl = 'https://api.freecurrencyapi.com/v1/historical'; 
    // Define an array of currency codes to be used in the dropdowns
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; 

    // Define a debounce function to limit the rate at which a function can fire
    function debounce(func, delay) { 
        let timeout; 
        return function () { 
            const context = this; 
            const args = arguments; 
            clearTimeout(timeout); 
            timeout = setTimeout(() => func.apply(context, args), delay); 
        }; 
    }

    // Function to populate the currency select elements with options
    function populateCurrencySelects() { 
        currencies.forEach(currency => { 
            // Create an option element for the base currency select
            const option1 = document.createElement('option'); 
            option1.value = currency; 
            option1.text = currency; 
            baseCurrencySelect.appendChild(option1); 

            // Create an option element for the target currency select
            const option2 = document.createElement('option'); 
            option2.value = currency; 
            option2.text = currency; 
            targetCurrencySelect.appendChild(option2); 
        }); 
        // Log a message indicating that the dropdowns have been populated
        console.log('Currency dropdowns populated'); 
    }

    // Call the function to populate the currency select elements
    populateCurrencySelects();

    // Function to fetch exchange rates for a given base currency
    function fetchExchangeRates(baseCurrency) { 
        // Define the request options, including the API key in the headers
        const requestOptions = { 
            method: 'GET', 
            headers: { 
                'apikey': apiKey 
            } 
        };

        // Fetch the exchange rates from the API
        return fetch(`${apiUrl}?base_currency=${baseCurrency}`, requestOptions) 
            .then(response => response.json()) 
            .then(data => { 
                // Log the fetched exchange rates
                console.log('Exchange rates fetched', data); 
                return data; 
            }) 
            .catch(error => { 
                // Log and alert an error if fetching exchange rates fails
                console.error('Error fetching exchange rates:', error); 
                alert('Error fetching exchange rates. Please try again later.'); 
            }); 
    }

    // Function to convert the currency based on the selected values and input amount
    function convertCurrency() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const amount = parseFloat(amountInput.value); 

        // Validate the input amount
        if (isNaN(amount) || amount <= 0) { 
            alert('Please enter a valid amount.'); 
            return; 
        }

        // Fetch the exchange rates and calculate the converted amount
        fetchExchangeRates(baseCurrency) 
            .then(data => { 
                if (data && data.data) { 
                    const rate = data.data[targetCurrency]; 
                    const convertedAmount = (amount * rate).toFixed(2); 
                    // Display the converted amount
                    convertedAmountSpan.textContent = `${convertedAmount} ${targetCurrency}`; 
                } else { 
                    console.error('Invalid data structure', data); 
                    alert('Error fetching exchange rates. Please try again later.'); 
                } 
            }); 
    }

    // Create a debounced version of the convertCurrency function
    const debouncedConvertCurrency = debounce(convertCurrency, 400); 

    // Function to fetch historical exchange rates for a given date
    function fetchHistoricalRates() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const date = historicalDateInput.value; 

        // Validate the selected date
        if (!date) { 
            alert('Please select a date.'); 
            return; 
        }

        // Define the request options, including the API key in the headers
        const requestOptions = { 
            method: 'GET', 
            headers: { 
                'apikey': apiKey 
            } 
        };

        // Fetch the historical exchange rates from the API
        fetch(`${historicalApiUrl}?base_currency=${baseCurrency}&date=${date}&currencies=${targetCurrency}`, requestOptions) 
            .then(response => response.json()) 
            .then(data => { 
                // Log the fetched historical rates
                console.log('Historical rates fetched', data); 
                if (data && data.data && data.data[date]) { 
                    const rate = data.data[date][targetCurrency]; 
                    // Display the historical exchange rate
                    historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`; 
                } else { 
                    console.error('Invalid historical data structure', data); 
                    alert(`Error fetching historical rates: ${data.message}`); 
                } 
            }) 
            .catch(error => { 
                // Log and alert an error if fetching historical rates fails
                console.error('Error fetching historical rates:', error); 
                alert('Error fetching historical rates. Please try again later.'); 
            }); 
    }

    // Function to save the selected currency pair as a favorite
    function saveFavoritePair() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const favoritePair = `${baseCurrency}/${targetCurrency}`;

        // Send a POST request to save the favorite currency pair
        fetch('/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ baseCurrency, targetCurrency })
        })
        .then(response => response.json())
        .then(data => {
            // Display the updated list of favorite pairs
            displayFavoritePairs();
            console.log('Favorite pair saved:', favoritePair);
        })
        .catch(error => {
            // Log an error if saving the favorite pair fails
            console.error('Error saving favorite pair:', error);
        });
    }

    // Function to display the list of favorite currency pairs
    function displayFavoritePairs() { 
        // Clear the container before displaying the favorite pairs
        favoriteCurrencyPairsContainer.innerHTML = ''; 

        // Fetch the favorite pairs from the server
        fetch('/favorites')
        .then(response => response.json())
        .then(favoritePairs => {
            // Create a button for each favorite pair
            favoritePairs.forEach(pair => {
                const button = document.createElement('button');
                button.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
                // Set up the button to set the currency selects and convert currency on click
                button.onclick = () => {
                    baseCurrencySelect.value = pair.baseCurrency;
                    targetCurrencySelect.value = pair.targetCurrency;
                    convertCurrency();
                };
                // Append the button to the container
                favoriteCurrencyPairsContainer.appendChild(button);
            });
            console.log('Favorite pairs displayed:', favoritePairs);
        })
        .catch(error => {
            // Log an error if displaying the favorite pairs fails
            console.error('Error displaying favorite pairs:', error);
        });
    }

    // Add event listeners to the select elements and input field to convert currency on change/input
    baseCurrencySelect.addEventListener('change', convertCurrency); 
    targetCurrencySelect.addEventListener('change', convertCurrency); 
    amountInput.addEventListener('input', debouncedConvertCurrency); 
    // Add an event listener to the historical rates button to fetch historical rates on click
    historicalRatesBtn.addEventListener('click', fetchHistoricalRates); 
    // Add an event listener to the save favorite button to save the favorite pair on click
    saveFavoriteBtn.addEventListener('click', saveFavoritePair); 

    // Display the favorite currency pairs on page load
    displayFavoritePairs(); 
});
