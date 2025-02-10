// First Aid Database
const firstAidData = {
    burns: {
        title: "Burns Treatment",
        content: `
            <h4>Steps for Treating Burns:</h4>
            <ol>
                <li>Cool the burn under cool (not cold) running water for at least 10 minutes</li>
                <li>Remove any jewelry or tight items near the burned area</li>
                <li>Cover with a sterile gauze bandage</li>
                <li>Take an over-the-counter pain reliever if needed</li>
                <li>Don't break blisters</li>
                <li>Seek medical attention for severe burns</li>
            </ol>
            <div class="alert alert-danger mt-3">
                <strong>Warning:</strong> Don't use ice, butter, or ointments on burns
            </div>
        `
    },
    fractures: {
        title: "Fractures First Aid",
        content: `
            <h4>Steps for Handling Fractures:</h4>
            <ol>
                <li>Stop any bleeding with gentle pressure</li>
                <li>Immobilize the injured area</li>
                <li>Apply ice packs to limit swelling</li>
                <li>Treat for shock if necessary</li>
            </ol>
            <div class="alert alert-warning mt-3">
                <strong>Important:</strong> Don't move the person unless absolutely necessary
            </div>
        `
    },
    // Add more first aid scenarios as needed
};

// Initialize emergency contacts from localStorage
// First Aid Database remains the same...

// Initialize emergency contacts from localStorage
let emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    populateFirstAidCards();
    initializeFirstAidHandlers();
});

// Initialize First Aid click handlers
function initializeFirstAidHandlers() {
    document.querySelectorAll('.first-aid-card').forEach(card => {
        card.addEventListener('click', () => {
            const scenario = card.dataset.scenario;
            showFirstAidInstructions(scenario);
        });
    });
}

// Rest of your existing functions...

// Update file paths in service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Populate First Aid Cards
function populateFirstAidCards() {
    const firstAidList = document.getElementById('firstAidList');
    
    Object.keys(firstAidData).forEach(key => {
        const data = firstAidData[key];
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card bg-dark text-white first-aid-card border-primary h-100" data-scenario="${key}">
                <div class="card-body">
                    <span class="offline-badge badge bg-success">Available Offline</span>
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">Click to view detailed instructions</p>
                </div>
            </div>
        `;
        firstAidList.appendChild(card);
    });
}

// Show First Aid Instructions
function showFirstAidInstructions(scenario) {
    const data = firstAidData[scenario];
    document.getElementById('firstAidModalTitle').textContent = data.title;
    document.getElementById('firstAidModalContent').innerHTML = data.content;
    new bootstrap.Modal(document.getElementById('firstAidModal')).show();
}

// Render Emergency Contacts
function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    emergencyContacts.forEach((contact, index) => {
        const contactCard = document.createElement('div');
        contactCard.className = 'col-md-6 col-lg-4';
        contactCard.innerHTML = `
            <div class="card bg-dark text-white contact-card border-primary">
                <div class="card-body">
                    <h5 class="card-title">${contact.name}</h5>
                    <p class="card-text">
                        <i class="bi bi-telephone-fill me-2"></i>${contact.phone}<br>
                        <i class="bi bi-heart-fill me-2"></i>${contact.relation}
                    </p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="sendSOS(${index})">
                            Send SOS
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        contactsList.appendChild(contactCard);
    });
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Add New Contact
document.getElementById('saveContact').addEventListener('click', () => {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const relation = document.getElementById('contactRelation').value;
    
    if (name && phone && relation) {
        emergencyContacts.push({ name, phone, relation });
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
        renderContacts();
        bootstrap.Modal.getInstance(document.getElementById('addContactModal')).hide();
        document.getElementById('contactForm').reset();
    }
});

// Delete Contact
function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        emergencyContacts.splice(index, 1);
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
        renderContacts();
    }
}

// Send SOS Message
// Update the sendSOS function in emergency-portal.js

async function sendSOS(contactIndex) {
    try {
        const position = await getCurrentPosition();
        const contact = emergencyContacts[contactIndex];
        
        const response = await fetch('http://localhost:3000/api/send-sos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: contact.phone,
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                name: contact.name
            })
        });

        const result = await response.json();
        
        if (result.success) {
            alert(`Emergency message sent successfully to ${contact.name}`);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending SOS:', error);
        alert('Failed to send emergency message. Please try again or contact emergency services directly.');
    }
}

// Update the global SOS button handler
document.getElementById('sosButton').addEventListener('click', async () => {
    try {
        const position = await getCurrentPosition();
        
        // Send SOS to all contacts
        const sendPromises = emergencyContacts.map(contact => {
            return fetch('http://localhost:3000/api/send-sos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: contact.phone,
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    name: contact.name
                })
            });
        });

        const results = await Promise.all(sendPromises);
        alert('Emergency messages sent to all contacts');
    } catch (error) {
        console.error('Error sending SOS messages:', error);
        alert('Failed to send emergency messages. Please try again or contact emergency services directly.');
    }
});