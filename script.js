document.addEventListener('DOMContentLoaded', function () { 
    // This event listener waits for the entire DOM to be loaded before running the script

    const baseCurrencySelect = document.getElementById('base-currency'); 
    // Selects the dropdown for base currency

    const targetCurrencySelect = document.getElementById('target-currency'); 
    // Selects the dropdown for target currency

    const amountInput = document.getElementById('amount'); 
    // Selects the input field for the amount to convert

    const convertedAmountSpan = document.getElementById('converted-amount'); 
    // Selects the span where the converted amount will be displayed

    const historicalRatesBtn = document.getElementById('historical-rates'); 
    // Selects the button to view historical rates

    const historicalRatesContainer = document.getElementById('historical-rates-container'); 
    // Selects the container to display historical rates

    const historicalDateInput = document.getElementById('historical-date'); 
    // Selects the input field for the date to get historical rates

    const saveFavoriteBtn = document.getElementById('save-favorite'); 
    // Selects the button to save favorite currency pairs

    const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs'); 
    // Selects the container to display saved favorite currency pairs

    const apiKey = 'fca_live_ZOGTfTQyfhUJZIo7g114IDshDLPZj1Tck5EySkxk'; 
    // Your API key for Free Currency API

    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest'; 
    // URL for fetching the latest exchange rates

    const historicalApiUrl = 'https://api.freecurrencyapi.com/v1/historical'; 
    // URL for fetching historical exchange rates

    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; 
    // Array of currencies to populate the dropdowns

    // Debounce function to limit the rate at which a function is executed
    function debounce(func, delay) { 
        let timeout; 
        return function () { 
            const context = this; 
            const args = arguments; 
            clearTimeout(timeout); 
            timeout = setTimeout(() => func.apply(context, args), delay); 
        }; 
    }

    // Function to populate the currency dropdowns
    function populateCurrencySelects() { 
        currencies.forEach(currency => { 
            const option1 = document.createElement('option'); 
            option1.value = currency; 
            option1.text = currency; 
            baseCurrencySelect.appendChild(option1); 

            const option2 = document.createElement('option'); 
            option2.value = currency; 
            option2.text = currency; 
            targetCurrencySelect.appendChild(option2); 
        }); 
        console.log('Currency dropdowns populated'); 
    }

    populateCurrencySelects(); 
    // Call the function to populate currency dropdowns

    // Function to fetch the latest exchange rates
    function fetchExchangeRates(baseCurrency) { 
        const requestOptions = { 
            method: 'GET', 
            headers: { 
                'apikey': apiKey 
            } 
        };

        return fetch(`${apiUrl}?base_currency=${baseCurrency}`, requestOptions) 
            .then(response => response.json()) 
            .then(data => { 
                console.log('Exchange rates fetched', data); 
                return data; 
            }) 
            .catch(error => { 
                console.error('Error fetching exchange rates:', error); 
                alert('Error fetching exchange rates. Please try again later.'); 
            }); 
    }

    // Function to perform currency conversion
    function convertCurrency() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const amount = parseFloat(amountInput.value); 

        if (isNaN(amount) || amount <= 0) { 
            alert('Please enter a valid amount.'); 
            return; 
        }

        fetchExchangeRates(baseCurrency) 
            .then(data => { 
                if (data && data.data) { 
                    const rate = data.data[targetCurrency]; 
                    const convertedAmount = (amount * rate).toFixed(2); 
                    convertedAmountSpan.textContent = `${convertedAmount} ${targetCurrency}`; 
                } else { 
                    console.error('Invalid data structure', data); 
                    alert('Error fetching exchange rates. Please try again later.'); 
                } 
            }); 
    }

    // Debounced version of convertCurrency to limit API calls
    const debouncedConvertCurrency = debounce(convertCurrency, 400); 

    // Function to fetch historical exchange rates
    function fetchHistoricalRates() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const date = historicalDateInput.value; 

        if (!date) { 
            alert('Please select a date.'); 
            return; 
        }

        const requestOptions = { 
            method: 'GET', 
            headers: { 
                'apikey': apiKey 
            } 
        };

        fetch(`${historicalApiUrl}?base_currency=${baseCurrency}&date=${date}&currencies=${targetCurrency}`, requestOptions) 
            .then(response => response.json()) 
            .then(data => { 
                console.log('Historical rates fetched', data); 
                if (data && data.data && data.data[date]) { 
                    const rate = data.data[date][targetCurrency]; 
                    historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`; 
                } else { 
                    console.error('Invalid historical data structure', data); 
                    alert(`Error fetching historical rates: ${data.message}`); 
                } 
            }) 
            .catch(error => { 
                console.error('Error fetching historical rates:', error); 
                alert('Error fetching historical rates. Please try again later.'); 
            }); 
    }

    // Function to save favorite currency pair
    function saveFavoritePair() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const favoritePair = `${baseCurrency}/${targetCurrency}`; 

        // Save favorite pairs to local storage
        let favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || []; 
        if (!favoritePairs.includes(favoritePair)) { 
            favoritePairs.push(favoritePair); 
            localStorage.setItem('favoritePairs', JSON.stringify(favoritePairs)); 
        }

        displayFavoritePairs(); 
        console.log('Favorite pair saved:', favoritePair); 
    }

    // Function to display favorite currency pairs
    function displayFavoritePairs() { 
        favoriteCurrencyPairsContainer.innerHTML = ''; 
        const favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || []; 

        favoritePairs.forEach(pair => { 
            const button = document.createElement('button'); 
            button.textContent = pair; 
            button.onclick = () => { 
                const [base, target] = pair.split('/'); 
                baseCurrencySelect.value = base; 
                targetCurrencySelect.value = target; 
                convertCurrency(); 
            }; 
            favoriteCurrencyPairsContainer.appendChild(button); 
        }); 
        console.log('Favorite pairs displayed:', favoritePairs); 
    }

    displayFavoritePairs(); 
    // Call the function to display saved favorite currency pairs

    // Event listeners for various user actions
    baseCurrencySelect.addEventListener('change', convertCurrency); 
    // Event listener for changes in base currency dropdown

    targetCurrencySelect.addEventListener('change', convertCurrency); 
    // Event listener for changes in target currency dropdown

    amountInput.addEventListener('input', debouncedConvertCurrency); 
    // Event listener for changes in the amount input, with debounce

    historicalRatesBtn.addEventListener('click', fetchHistoricalRates); 
    // Event listener for clicking the historical rates button

    saveFavoriteBtn.addEventListener('click', saveFavoritePair); 
    // Event listener for clicking the save favorite button
});
