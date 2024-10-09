// app/static/js/chatbot.js
function sendChat() {
    const input = document.getElementById('chat_input').value;
    const chatbox = document.getElementById('chatbot');

    if (input.trim() === "") {
        return;
    }

    // Display user's message
    const userMessage = document.createElement('p');
    userMessage.style.textAlign = "right";
    userMessage.innerHTML = `<strong>You:</strong> ${input}`;
    chatbox.appendChild(userMessage);

    // Send message to server
    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `message=${encodeURIComponent(input)}`
    })
    .then(response => response.text())
    .then(data => {
        // Display chatbot's response
        const botMessage = document.createElement('p');
        botMessage.style.textAlign = "left";
        botMessage.innerHTML = `<strong>Bot:</strong> ${data}`;
        chatbox.appendChild(botMessage);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Clear input
    document.getElementById('chat_input').value = '';
}
