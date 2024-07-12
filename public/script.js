document.addEventListener('DOMContentLoaded', function () { 
    const baseCurrencySelect = document.getElementById('base-currency'); 
    const targetCurrencySelect = document.getElementById('target-currency'); 
    const amountInput = document.getElementById('amount'); 
    const convertedAmountSpan = document.getElementById('converted-amount'); 
    const historicalRatesBtn = document.getElementById('historical-rates'); 
    const historicalRatesContainer = document.getElementById('historical-rates-container'); 
    const historicalDateInput = document.getElementById('historical-date'); 
    const saveFavoriteBtn = document.getElementById('save-favorite'); 
    const favoriteCurrencyPairsContainer = document.getElementById('favorite-currency-pairs'); 

    const apiKey = 'fca_live_ZOGTfTQyfhUJZIo7g114IDshDLPZj1Tck5EySkxk'; 
    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest'; 
    const historicalApiUrl = 'https://api.freecurrencyapi.com/v1/historical'; 
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; 

    function debounce(func, delay) { 
        let timeout; 
        return function () { 
            const context = this; 
            const args = arguments; 
            clearTimeout(timeout); 
            timeout = setTimeout(() => func.apply(context, args), delay); 
        }; 
    }

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

    const debouncedConvertCurrency = debounce(convertCurrency, 400); 

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

    function saveFavoritePair() { 
        const baseCurrency = baseCurrencySelect.value; 
        const targetCurrency = targetCurrencySelect.value; 
        const favoritePair = `${baseCurrency}/${targetCurrency}`;

        fetch('/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ baseCurrency, targetCurrency })
        })
        .then(response => response.json())
        .then(data => {
            displayFavoritePairs();
            console.log('Favorite pair saved:', favoritePair);
        })
        .catch(error => {
            console.error('Error saving favorite pair:', error);
        });
    }

    function displayFavoritePairs() { 
        favoriteCurrencyPairsContainer.innerHTML = ''; 

        fetch('/favorites')
        .then(response => response.json())
        .then(favoritePairs => {
            favoritePairs.forEach(pair => {
                const button = document.createElement('button');
                button.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
                button.onclick = () => {
                    baseCurrencySelect.value = pair.baseCurrency;
                    targetCurrencySelect.value = pair.targetCurrency;
                    convertCurrency();
                };
                favoriteCurrencyPairsContainer.appendChild(button);
            });
            console.log('Favorite pairs displayed:', favoritePairs);
        })
        .catch(error => {
            console.error('Error displaying favorite pairs:', error);
        });
    }

    baseCurrencySelect.addEventListener('change', convertCurrency); 
    targetCurrencySelect.addEventListener('change', convertCurrency); 
    amountInput.addEventListener('input', debouncedConvertCurrency); 
    historicalRatesBtn.addEventListener('click', fetchHistoricalRates); 
    saveFavoriteBtn.addEventListener('click', saveFavoritePair); 

    displayFavoritePairs(); 
});
