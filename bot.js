async function askDeepSeek() {
    const question = document.getElementById('userQuestion').value.trim();
    const responseBox = document.getElementById('aiResponse');
    const answerText = document.getElementById('answerText');
    const buttonText = document.getElementById('button-text');
    const submitButton = document.querySelector('.chatbot-submit');

    if (!question) {
        answerText.textContent = "Please enter a question first";
        responseBox.style.display = 'block';
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    buttonText.innerHTML = '<span class="loading"></span> Processing';
    responseBox.style.display = 'block';
    answerText.innerHTML = '<div style="text-align: center;"><span class="loading"></span> Thinking...</div>';

    try {
        // API configuration
        const apiKey = "sk-073a705e762d46bd927fda4ca8ada9e5"; // Replace with your actual API key
        const apiUrl = "https://api.deepseek.com/v1/chat/completions";
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{
                    role: "system",
                    content: "You are a helpful civic education expert assistant. Provide clear, concise answers about environmental issues, media literacy, citizenship, social harmony, entrepreneurship, and health education."
                }, {
                    role: "user",
                    content: question
                }],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            answerText.innerHTML = formatResponse(data.choices[0].message.content);
        } else {
            throw new Error("Unexpected API response format");
        }
        
    } catch (error) {
        console.error("API Error:", error);
        answerText.innerHTML = `
            <p>I'm having trouble answering your question right now.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please try again later or contact support if the problem persists.</p>
        `;
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.textContent = "Ask AI";
    }
}

// Helper function to format the response
function formatResponse(text) {
    // Convert markdown-like formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
        .replace(/\n\n/g, '</p><p>') // paragraphs
        .replace(/\n/g, '<br>'); // line breaks
    
    // Ensure proper paragraph formatting
    if (!formatted.startsWith('<p>')) {
        formatted = '<p>' + formatted;
    }
    if (!formatted.endsWith('</p>')) {
        formatted = formatted + '</p>';
    }
    
    return formatted;
}