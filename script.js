(function() {
    // DOM References
    const topic = document.getElementById('topic');
    const getQuoteButton = document.getElementById('get-quote-button');
    const output = document.getElementById('output');

    // Event Listener
    getQuoteButton.addEventListener('click', getRandomQuote);

    // Functions
    async function getRandomQuote(e) {
        e.preventDefault();
        output.replaceChildren('');
        const topicSelected = topic.value;
        try {
            const quote = await searchQuote(topicSelected);
            if(quote === null) {
                displayError(`No quotes found for this topic - ${topicSelected}`);
            } else {
                displayResult(quote);
            }
        } catch (error) {
            displayError('Unable to get Quote');
        }
        return;
    };

    async function searchQuote(topic) {
        const data = await fetchData();
        const t = topic.toLowerCase();
        const listOfQuotes = data.filter(quote => quote['topic'].some(qt => qt.toLowerCase() === t));
        if(listOfQuotes.length === 0) {
            return null;
        }
        const randomQuotePick = listOfQuotes[Math.floor(Math.random() * listOfQuotes.length)];
        return randomQuotePick;
        
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
        try {
            const quoteElement = document.createElement('blockquote');
            const emElement = document.createElement('em');
            emElement.textContent = `"${quote.quote}"`;
            quoteElement.appendChild(emElement);
            const authorElement = document.createElement('figcaption');
            const strongElement = document.createElement('strong');
            strongElement.textContent = `- ${quote['author']}`;
            authorElement.appendChild(strongElement);
            output.appendChild(quoteElement);
            output.appendChild(authorElement);
            return;
        } catch (error) {
            console.error('Error', error);
            displayError(error);
            return;
        };
    };

    function displayError(error) {
        output.replaceChildren();
        output.style.backgroundColor = 'red';
        output.style.color = 'white';
        const textElement = document.createElement('h4');
        const strongElement = document.createElement('strong');
        strongElement.textContent = error;
        textElement.appendChild(strongElement);
        output.appendChild(textElement);
    }
}) ();
