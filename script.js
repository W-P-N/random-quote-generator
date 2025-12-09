(function() {
    // DOM References
    const topic = document.getElementById('topic');
    const getQuoteButton = document.getElementById('get-quote-button');
    const output = document.getElementById('output');

    // Event Listener
    getQuoteButton.addEventListener('click', getRandomQuote);

    // Functions
    async function getRandomQuote() {
        output.replaceChildren('');
        const topicSelected = topic.value;
        const quote = await searchQuote(topicSelected);
        if(!quote) {
            displayResult('Unable to get quote. Please try again later!');
            return;
        };
        displayResult(quote);
        return;
    };

    async function searchQuote(topic) {
        try {
            const data = await fetchData();
            const listOfQuotes = data.filter(quote => quote['topic'].map(quoteTopic => quoteTopic.toLowerCase()).includes(topic));
            const randomQuotePick = listOfQuotes[Math.floor(Math.random() * (listOfQuotes.length + 1))];
            return randomQuotePick;
        } catch (error) {
            console.error('Error: ', error);
            return;
        };
    };

    async function fetchData() {
        return fetch('./data.json')
            .then(response => {
                if(!response.ok) {
                    throw new Error('Unable to fetch quote');
                }
                return response.json();
            })
    };

    function displayResult(quote) {
        console.log(quote)
        try {
            const quoteElement = document.createElement('h3');
            quoteElement.innerHTML = `<em>"${quote.quote}"</em`;
            const authorElement = document.createElement('p');
            authorElement.innerHTML = `<strong>- ${quote['author']}</strong>`;
            output.appendChild(quoteElement);
            output.appendChild(authorElement);
            return;
        } catch (error) {
            console.error('Error', error);
            return;
        }
    };
}) ();
