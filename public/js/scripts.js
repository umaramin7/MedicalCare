// Expanded dataset for symptom checker
const symptomDataset = {
    "chest pain": {
        firstAid: "Rest immediately and avoid exertion. Loosen tight clothing and stay calm. Call emergency services if severe.",
        risks: "Heart attack, angina, muscle strain"
    },
    "dizziness": {
        firstAid: "Sit or lie down to prevent falls. Keep your head level. Drink water if you suspect dehydration.",
        risks: "Dehydration, low blood pressure, vertigo"
    },
    "fever": {
        firstAid: "Stay hydrated with water or electrolyte solutions. Use a damp cloth to cool the forehead.",
        risks: "Infections, flu, heat exhaustion"
    },
    "cough": {
        firstAid: "Stay hydrated and sip warm fluids like honey-lemon tea. Avoid dusty environments.",
        risks: "Common cold, bronchitis, allergies"
    },
    "nausea": {
        firstAid: "Sit upright and take small sips of ginger tea. Avoid strong odors.",
        risks: "Food poisoning, motion sickness, migraines"
    },
    "headache": {
        firstAid: "Rest in a dark, quiet room. Apply a cold compress to your forehead.",
        risks: "Tension headache, migraine, sinus infection"
    },
    "abdominal pain": {
        firstAid: "Avoid eating heavy meals. Sip warm water or herbal tea. Seek help if pain is severe.",
        risks: "Indigestion, appendicitis, ulcers"
    },
    "burns": {
        firstAid: "Cool the area under running water for 10 minutes. Avoid ice. Cover with a clean, non-stick dressing.",
        risks: "Infection, blisters, scarring"
    },
    "cuts": {
        firstAid: "Apply pressure to stop bleeding. Clean the wound with mild soap and water. Use a sterile bandage.",
        risks: "Infection, excessive bleeding, scarring"
    },
    "shortness of breath": {
        firstAid: "Sit upright and relax. Use an inhaler if prescribed. Seek immediate help if symptoms persist.",
        risks: "Asthma, heart issues, anxiety attack"
    },
    "rash": {
        firstAid: "Wash the area with mild soap and cool water. Avoid scratching. Use anti-itch cream if needed.",
        risks: "Allergic reaction, eczema, fungal infection"
    },
    "vomiting": {
        firstAid: "Sip small amounts of clear fluids to stay hydrated. Avoid solid foods until vomiting stops.",
        risks: "Food poisoning, stomach virus, dehydration"
    },
    "back pain": {
        firstAid: "Apply a hot or cold compress to the area. Rest and avoid heavy lifting.",
        risks: "Muscle strain, herniated disc, kidney issues"
    },
    "nosebleed": {
        firstAid: "Sit upright and lean forward slightly. Pinch the soft part of your nose for 5-10 minutes.",
        risks: "Dry air, nose injury, high blood pressure"
    },
    "sore throat": {
        firstAid: "Gargle with warm salt water. Drink warm fluids and avoid cold drinks.",
        risks: "Cold, strep throat, tonsillitis"
    },
    "sprain": {
        firstAid: "Rest the joint, apply ice for 15-20 minutes, compress with a bandage, and elevate the limb.",
        risks: "Ligament tear, swelling, pain"
    },
    "diarrhea": {
        firstAid: "Stay hydrated with oral rehydration solutions. Avoid caffeine and greasy foods.",
        risks: "Dehydration, food poisoning, infection"
    },
    "earache": {
        firstAid: "Use a warm compress on the ear. Avoid inserting anything into the ear.",
        risks: "Ear infection, wax buildup, eardrum injury"
    },
    "toothache": {
        firstAid: "Rinse your mouth with warm salt water. Use a cold compress on your cheek if swollen.",
        risks: "Cavity, abscess, gum infection"
    },
    "allergic reaction": {
        firstAid: "Take an antihistamine if available. For severe reactions, use an epinephrine injector and seek help.",
        risks: "Anaphylaxis, swelling, breathing difficulties"
    }
};
const symptomsInput = document.getElementById("symptoms");
const suggestionBox = document.getElementById("suggestionBox");
const selectedSymptomsDiv = document.getElementById("selectedSymptoms");
const selectedSymptoms = new Set();

// Show suggestions as user types
symptomsInput.addEventListener("input", function(e) {
    const input = e.target.value.toLowerCase();
    if (input.length < 2) {
        suggestionBox.classList.add("d-none");
        return;
    }

    const matchingSymptoms = Object.keys(symptomDataset)
        .filter(symptom => symptom.toLowerCase().includes(input));

    if (matchingSymptoms.length > 0) {
        suggestionBox.innerHTML = matchingSymptoms
            .map(symptom => `<div class="suggestion-item">${symptom}</div>`)
            .join("");
        suggestionBox.classList.remove("d-none");
    } else {
        suggestionBox.classList.add("d-none");
    }
});

// Handle suggestion selection
suggestionBox.addEventListener("click", function(e) {
    if (e.target.classList.contains("suggestion-item")) {
        const symptom = e.target.textContent;
        selectedSymptoms.add(symptom);
        updateSelectedSymptoms();
        symptomsInput.value = "";
        suggestionBox.classList.add("d-none");
    }
});

function updateSelectedSymptoms() {
    selectedSymptomsDiv.innerHTML = Array.from(selectedSymptoms)
        .map(symptom => `
            <span class="badge bg-primary me-2 mb-2 p-2">
                ${symptom}
                <i class="fas fa-times ms-2" onclick="removeSymptom('${symptom}')"></i>
            </span>
        `).join("");
}

function removeSymptom(symptom) {
    selectedSymptoms.delete(symptom);
    updateSelectedSymptoms();
}

// Handle form submission
document.getElementById("symptomForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const resultDiv = document.getElementById("result");
    
    if (selectedSymptoms.size === 0) {
        resultDiv.innerHTML = `
            <div class="alert alert-warning">
                Please select at least one symptom.
            </div>
        `;
        return;
    }

    let combinedFirstAid = [];
    let combinedRisks = [];

    selectedSymptoms.forEach(symptom => {
        const { firstAid, risks } = symptomDataset[symptom];
        combinedFirstAid.push(`<li class="mb-2">${firstAid}</li>`);
        combinedRisks.push(`<li class="mb-2">${risks}</li>`);
    });

    resultDiv.innerHTML = `
        <div class="card p-4">
            <div class="alert alert-info">
                <h5><i class="fas fa-first-aid me-2"></i>First Aid:</h5>
                <ul class="mb-4">${combinedFirstAid.join("")}</ul>
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Potential Risks:</h5>
                <ul>${combinedRisks.join("")}</ul>
            </div>
            <div class="alert alert-warning mb-0">
                <i class="fas fa-info-circle me-2"></i>
                This is for informational purposes only. Always consult a healthcare professional for medical advice.
            </div>
        </div>
    `;
});