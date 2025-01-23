const buttonlancer = document.getElementById('buttonlancer');
const page1 = document.querySelector('.page1');
const page2 = document.querySelector('.page2');
const text1 = document.querySelector('.text1');
const text2 = document.querySelector('.text2');
const text3 = document.querySelector('.text3');
const choixImg1 = document.querySelector('.choix1');
const choixImg2 = document.querySelector('.choix2');
const choixImg3 = document.querySelector('.choix3');
const pDirecteur = document.querySelector('.pDirecteur');
const textarea = document.querySelector('textarea');
const choixHistoire = document.querySelector('.choixhistoire');
const pChoix = document.querySelector('.pChoix');

let currentPath = null;
let storyData = null;

buttonlancer.addEventListener('click', function() {
    page1.style.display = 'none';
    page2.style.display = 'flex';
});

async function loadStoryData() {
    try {
        const response = await fetch("story-json.json");
        storyData = await response.json();
        setupInitialScene();
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
    }
    console.log(storyData);
    console.log(storyData.paths["1"].image)
}

function setupInitialScene() {
    if (!storyData) {
        console.error("Les données de l'histoire ne sont pas chargées.");
        return;
    }
    // Mettre à jour le texte initial
    textarea.value = `${storyData.title}\n\n${storyData.introduction.setting}`;
    pDirecteur.textContent = storyData.introduction.initialScene;
    
    setupPathChoices();
}

function setupPathChoices() {
    const paths = storyData.paths;
    
    text1.textContent = `1. ${paths["1"].title}: ${paths["1"].description}`;
    text2.textContent = `2. ${paths["2"].title}: ${paths["2"].description}`;
    text3.textContent = `3. ${paths["3"].title}: ${paths["3"].description}`;

    // Ajouter les écouteurs d'événements
    setupChoiceListeners();
}

function setupChoiceListeners() {
    text1.addEventListener('click', () => {
        handleChoice("1")
        choixImg1.style.backgroundImage = `url(${storyData.paths["1"].image})`;
        choixImg1.style.width = "100%";
        choixImg2.style.display = "none";
        choixImg3.style.display = "none";  
        console.log(choixImg1);
        
    });

    text2.addEventListener('click', () => {
        handleChoice("2")
        choixImg2.style.backgroundImage = `url(${storyData.paths["2"].image})`;
        choixImg2.style.width = "100%"
        choixImg1.style.display = "none"
        choixImg3.style.display = "none"  
    });

    text3.addEventListener('click', () => {
        handleChoice("3")
        choixImg3.style.backgroundImage = `url(${storyData.paths["3"].image})`;
        choixImg3.style.width = "100%"
        choixImg1.style.display = "none"
        choixImg2.style.display = "none" 
});
}

function handleChoice(pathId) {
    const path = storyData.paths[pathId];
    currentPath = pathId;
    
    // Mettre à jour le texte principal
    textarea.value += `\n\n${path.scene}`;
    pDirecteur.textContent = path.scene;
    
    updateChoices(path.choices);
}

function updateChoices(choices) {
    pChoix.innerHTML = '';
    let index = 1;
    
    Object.entries(choices).forEach(([choiceId, choice]) => {
        const choiceElement = document.createElement('p');
        choiceElement.className = `p${index} text${index}`;
        choiceElement.textContent = `${index}. ${choice.text}`;

        choiceElement.addEventListener('click', () => {
            if ( currentPath === '1' && choice.image) {
                choixImg1.style.backgroundImage = `url(${choice.image})`;

            }else if ( currentPath === '2' && choice.image) {
                choixImg2.style.backgroundImage = `url(${choice.image})`;

            }else if (currentPath === '3' && choice.image) {
                choixImg3.style.backgroundImage = `url(${choice.image})`;

            }
                console.log(currentPath)
        });
        
        choiceElement.addEventListener('click', () => {
            if (choice.ending) {
                showEnding(choice.ending);
            } else if (choice.scene) {
                continueStory(choice);
            }
        });
        
        pChoix.appendChild(choiceElement);
        index++;
    });
}

// Afficher la fin de l'histoire
function showEnding(endingText) {
    textarea.value += `\n\n${endingText}`;
    pDirecteur.textContent = "Fin de l'histoire";
    pChoix.innerHTML = `
        <p class="ending-text">${endingText}</p>
        <button class="reload" onclick="window.location.reload()">Recommencer l'histoire</button>
    `;
}

// Continuer l'histoire
function continueStory(choice) {
    textarea.value += `\n\n${choice.scene}`;
    pDirecteur.textContent = choice.scene;
    updateChoices(choice.choices);
}

// Réinitialiser le jeu
function resetGame() {
    currentPath = null;

setupInitialScene();
}

// Charger les données au démarrage
loadStoryData();