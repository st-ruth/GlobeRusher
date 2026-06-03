// ==========================================================================
// LOCALSTORAGE & BOOKMARKS
// ==========================================================================
let savedForStudy = JSON.parse(localStorage.getItem('savedForStudy')) || []
let savedForQuiz = JSON.parse(localStorage.getItem('savedForQuiz')) || []
let currentOpenList = '' 

const savedCategoryMenu = document.getElementById('savedCategoryMenu')
const savedListContent = document.getElementById('savedListContent')
const savedListTitle = document.getElementById('savedListTitle')
const savedCardsContainer = document.getElementById('savedCardsContainer')
const cardOpenStudyList = document.getElementById('cardOpenStudyList')
const cardOpenQuizList = document.getElementById('cardOpenQuizList')
const btnBackToCategories = document.getElementById('btnBackToCategories')
const studyListCounter = document.getElementById('studyListCounter')
const quizListCounter = document.getElementById('quizListCounter')
const btnSavedMainAction = document.getElementById('btnSavedMainAction')
const btnSavedClearAll = document.getElementById('btnSavedClearAll')

const saveToLocalStorage = () => {
    localStorage.setItem('savedForStudy', JSON.stringify(savedForStudy))
    localStorage.setItem('savedForQuiz', JSON.stringify(savedForQuiz))
}

const addToStudyList = (country) => {
    if (savedForStudy.some(c => c.name.common === country.name.common)) {
        showToast('Already in your Study list!', 'warning'); return
    }
    savedForStudy.push(country); saveToLocalStorage(); updateSavedCounters();
    showToast(`Saved ${country.name.common} to Study List!`, 'success')
}

const addToQuizList = (country) => {
    if (savedForQuiz.some(c => c.name.common === country.name.common)) {
        showToast('Already in your Quiz pool!', 'warning'); return
    }
    savedForQuiz.push(country); saveToLocalStorage(); updateSavedCounters();
    showToast(`Added ${country.name.common} to Quiz Pool!`, 'success')
}

const quizNow = (country) => { showView(quizView); startCustomQuiz([country]); }

function updateSavedCounters() {
    if(studyListCounter) studyListCounter.textContent = `${savedForStudy.length} ${savedForStudy.length === 1 ? 'country' : 'countries'} saved`
    if(quizListCounter) quizListCounter.textContent = `${savedForQuiz.length} ${savedForQuiz.length === 1 ? 'country' : 'countries'} saved`
}

function removeCountry(countryName, listType) {
    if (listType === 'study') savedForStudy = savedForStudy.filter(c => c.name.common !== countryName)
    if (listType === 'quiz') savedForQuiz = savedForQuiz.filter(c => c.name.common !== countryName)
    saveToLocalStorage(); updateSavedCounters(); openSavedList(listType);
    showToast('Removed country ✕', 'info')
}

function openSavedList(type) {
    currentOpenList = type
    savedCategoryMenu.classList.add('hidden')
    savedListContent.classList.remove('hidden')
    savedCardsContainer.innerHTML = ''
    const listToRender = type === 'study' ? savedForStudy : savedForQuiz
    
    if (type === 'study') {
        savedListTitle.textContent = 'My Study List'
        btnSavedMainAction.textContent = 'Send all to Quiz Pool'
    } else {
        savedListTitle.textContent = 'Ready for Quiz!'
        btnSavedMainAction.textContent = 'START QUIZ NOW'
    }
    if (listToRender.length === 0) {
        savedCardsContainer.innerHTML = '';
        const oldMsg = savedListContent.querySelector('.welcome-msg');
        if (oldMsg) oldMsg.remove();
        
        const emptyText = document.createElement('p');
        emptyText.className = 'welcome-msg';
        emptyText.textContent = 'This collection is empty. Go back and add some countries!';
        savedListContent.appendChild(emptyText);
        return;
    } else {
        const oldMsg = savedListContent.querySelector('.welcome-msg');
        if (oldMsg) oldMsg.remove();
    }
    listToRender.forEach(country => {
        const cleanData = getCleanCountryData(country)
        const cardContainer = document.createElement('div')
        cardContainer.classList.add('flip-card')
        const cardButtonsHTML = type === 'study' 
            ? '<button class="btn-save-quiz">Send to Quiz </button><button class="btn-card-remove">Remove ❌</button>'
            : '<button class="btn-quiz-now">Quiz Now!</button><button class="btn-card-remove">Remove ❌</button>'
        cardContainer.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${cleanData.flag}" alt="Flag of ${cleanData.name}" class="card-map-img">
                    <h3>${cleanData.name}</h3>
                </div>
                <div class="flip-card-back">
                    <img src="${cleanData.flag}" alt="Flag of ${cleanData.name}" class="card-stamp-flag">
                    <h3>${cleanData.name}</h3>
                    <p><strong>Capital:</strong> ${cleanData.capital}</p>
                    <p><strong>Region:</strong> ${cleanData.region}</p>
                    <div class="card-actions">${cardButtonsHTML}</div>
                </div>
            </div>
        `
        cardContainer.addEventListener('click', function() { this.classList.toggle('flipped') })
        cardContainer.querySelector('.btn-card-remove').addEventListener('click', (e) => { e.stopPropagation(); removeCountry(country.name.common, type); })
        if (type === 'study') {
            cardContainer.querySelector('.btn-save-quiz').addEventListener('click', (e) => {
                e.stopPropagation(); savedForStudy = savedForStudy.filter(c => c.name.common !== country.name.common);
                addToQuizList(country); saveToLocalStorage(); openSavedList('study');
            })
        }
        savedCardsContainer.appendChild(cardContainer)
    })
}

if(cardOpenStudyList) cardOpenStudyList.addEventListener('click', () => openSavedList('study'))
if(cardOpenQuizList) cardOpenQuizList.addEventListener('click', () => openSavedList('quiz'))
if(btnBackToCategories) btnBackToCategories.addEventListener('click', () => { savedCategoryMenu.classList.remove('hidden'); savedListContent.classList.add('hidden'); updateSavedCounters(); })

btnSavedMainAction.addEventListener('click', () => {
    if (currentOpenList === 'study') {
        if (savedForStudy.length === 0) return
        savedForStudy.forEach(country => { if (!savedForQuiz.some(c => c.name.common === country.name.common)) savedForQuiz.push(country) })
        savedForStudy = []; saveToLocalStorage(); openSavedList('study'); showToast('Sent all items to Quiz Pool! 🎯')
    } else if (currentOpenList === 'quiz') {
        if (savedForQuiz.length === 0) { showToast('Your quiz pool is empty!', 'warning'); return }
        showView(quizView); startCustomQuiz(savedForQuiz);
    }
})
if(btnSavedClearAll) btnSavedClearAll.addEventListener('click', () => { if (currentOpenList === 'study') savedForStudy = []; else savedForQuiz = []; saveToLocalStorage(); openSavedList(currentOpenList); showToast('Collection cleared 🗑️', 'info'); })