// ==========================================================================
// QUIZ ENGINE ENGINE & MENUS (quiz.js)
// ==========================================================================
let quizQuestions = []
let currentQuestionIndex = 0
let quizScore = 0
const MAX_CUSTOM_QUESTIONS = 30 
const WILDCARD_QUIZ_LENGTH = 10 

function initQuizMainMenu() {
    quizCardContainer.innerHTML = `
        <div class="saved-category-menu" id="quizModeMenu">
            <div class="category-card" id="cardStartCustomQuiz">
                <div class="category-card-icon">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-cog-icon lucide-brain-cog"><path d="m10.852 14.772-.383.923"/><path d="m10.852 9.228-.383-.923"/><path d="m13.148 14.772.382.924"/><path d="m13.531 8.305-.383.923"/><path d="m14.772 10.852.923-.383"/><path d="m14.772 13.148.923.383"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771"/><path d="M17.998 5.125a4 4 0 0 1 2.525 5.771"/><path d="M19.505 10.294a4 4 0 0 1-1.5 7.706"/><path d="M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516"/><path d="M4.5 10.291A4 4 0 0 0 6 18"/><path d="M6.002 5.125a3 3 0 0 0 .4 1.375"/><path d="m9.228 10.852-.923-.383"/><path d="m9.228 13.148-.923.383"/><circle cx="12" cy="12" r="3"/></svg></div>
                <h3>My Custom Quiz</h3>
                <p>${savedForQuiz.length} ${savedForQuiz.length === 1 ? 'country' : 'countries'} ready</p>
                <button class="category-card-btn">Play Custom ➔</button>
            </div>
            <div class="category-card" id="cardStartWildcardQuiz">
                <div class="category-card-icon">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shuffle-icon lucide-shuffle"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg></div>
                <h3>World Wildcard Quiz</h3>
                <p>10 random countries from the globe</p>
                <button class="category-card-btn">Play Random ➔</button>
            </div>
        </div>
    `

    document.getElementById('cardStartCustomQuiz').addEventListener('click', () => {
        if (savedForQuiz.length === 0) {
            quizCardContainer.innerHTML = `
                <div class="quiz-results-box">
                    <p class="error-msg" style="font-size: 1.3rem;">Uh-oh, you need to fill me up or take the random quiz! 🕵️‍♂️🗺️</p>
                    <p style="margin-bottom: 20px;">Go back to the study area and save some countries with the <strong>Quiz 🎯</strong> button.</p>
                    <button id="btnBackToQuizMenu" class="category-card-btn" style="max-width: 350px; margin: 0 auto; display: block;">Back to Quiz Menu ↩</button>
                </div>
            `
            document.getElementById('btnBackToQuizMenu').addEventListener('click', initQuizMainMenu)
            return
        }
        startCustomQuiz(savedForQuiz)
    })

    document.getElementById('cardStartWildcardQuiz').addEventListener('click', startWildcardQuiz)
}

function startCustomQuiz(sourcePool) {
    quizQuestions = []

    sourcePool.forEach(country => {
        const factTypes = ['name', 'capital', 'region', 'languages', 'currencies', 'population', 'area']
        factTypes.forEach(type => {
            quizQuestions.push({
                countryData: country,
                questionType: type
            })
        })
    })

    // Slumpa frågorna
    quizQuestions.sort(() => 0.5 - Math.random())

    if (quizQuestions.length > MAX_CUSTOM_QUESTIONS) {
        quizQuestions = quizQuestions.slice(0, MAX_CUSTOM_QUESTIONS)
    }

    currentQuestionIndex = 0
    quizScore = 0
    renderQuizQuestion()
}

function startWildcardQuiz() {
    const shuffledWorld = [...allCountries].sort(() => 0.5 - Math.random())
    const selected = shuffledWorld.slice(0, WILDCARD_QUIZ_LENGTH)

    quizQuestions = selected.map(country => ({
        countryData: country,
        questionType: Math.random() > 0.5 ? 'capital' : 'name'
    }))

    currentQuestionIndex = 0
    quizScore = 0
    renderQuizQuestion()
}

// ==========================================================================
// QUIZ RENDERING & QUESTION GENERATOR
// ==========================================================================
function renderQuizQuestion() {
    quizCardContainer.innerHTML = ''

    const currentQuestion = quizQuestions[currentQuestionIndex]
    const country = currentQuestion.countryData
    const type = currentQuestion.questionType
    const cleanCorrectData = getCleanCountryData(country)

    let questionTitle = ''
    let correctAnswer = ''
    let fakeKey = type 

    switch (type) {
        case 'name':
            questionTitle = `<h2>Which country does this flag belong to? 🎯</h2>`
            correctAnswer = cleanCorrectData.name
            break
        case 'capital':
            questionTitle = `<h2>What is the capital of ${cleanCorrectData.name}? 🗺️</h2>`
            correctAnswer = cleanCorrectData.capital
            break
        case 'region':
            questionTitle = `<h2>In which region/continent is ${cleanCorrectData.name} located? 🌍</h2>`
            correctAnswer = cleanCorrectData.region
            break
        case 'languages':
            questionTitle = `<h2>Which language(s) do they speak in ${cleanCorrectData.name}? 🗣️</h2>`
            correctAnswer = cleanCorrectData.languages
            break
        case 'currencies':
            questionTitle = `<h2>What is the official currency of ${cleanCorrectData.name}? 💳</h2>`
            correctAnswer = cleanCorrectData.currencies
            break
        case 'population':
            questionTitle = `<h2>What is the approximate population of ${cleanCorrectData.name}? 👥</h2>`
            correctAnswer = cleanCorrectData.population
            break
        case 'area':
            questionTitle = `<h2>How large is the total area of ${cleanCorrectData.name}? 📏</h2>`
            correctAnswer = cleanCorrectData.area + " km²"
            break
    }

    // Skapa en container för quiz-frågan
    const questionBox = document.createElement('div')
    questionBox.className = 'quiz-question-box'
    
    // UX-FIX: Skapa och lägg till X-knappen (avbryt-krysset)
    const closeBtn = document.createElement('button')
    closeBtn.className = 'quiz-close-x'
    closeBtn.id = 'btnExitQuiz'
    closeBtn.innerHTML = '×'
    // När man klickar på krysset återgår vi till huvudmenyn för quizet
    closeBtn.addEventListener('click', initQuizMainMenu)
    questionBox.appendChild(closeBtn)

    // Lägg till frågetiteln efter krysset
    const titleContainer = document.createElement('div')
    titleContainer.innerHTML = questionTitle
    questionBox.appendChild(titleContainer)

    // Om det är en flaggfråga, visa flaggan tydligt
    if (type === 'name') {
        const flagImg = document.createElement('img')
        flagImg.src = cleanCorrectData.flag
        flagImg.className = 'quiz-flag-hint'
        flagImg.style.cssText = 'max-width: 200px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);'
        questionBox.appendChild(flagImg)
    }

    // Generera svarsalternativ (1 rätt, 3 fel)
    const optionsContainer = document.createElement('div')
    optionsContainer.className = 'quiz-options-container'
    optionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 400px; margin: 0 auto;'

    const answers = [correctAnswer]
    const shuffledPool = [...allCountries].sort(() => 0.5 - Math.random())

    for (let c of shuffledPool) {
        if (answers.length >= 4) break
        const cleanFake = getCleanCountryData(c)
        let fakeAns = ''
        
        switch(type) {
            case 'name': fakeAns = cleanFake.name; break;
            case 'capital': fakeAns = cleanFake.capital; break;
            case 'region': fakeAns = cleanFake.region; break;
            case 'languages': fakeAns = cleanFake.languages; break;
            case 'currencies': fakeAns = cleanFake.currencies; break;
            case 'population': fakeAns = cleanFake.population; break;
            case 'area': fakeAns = cleanFake.area + " km²"; break;
        }

        if (fakeAns && fakeAns !== 'N/A' && !answers.includes(fakeAns)) {
            answers.push(fakeAns)
        }
    }

    // Slumpa svarsordningen
    answers.sort(() => 0.5 - Math.random())

    answers.forEach(ans => {
        const btn = document.createElement('button')
        btn.className = 'category-card-btn'
        btn.textContent = ans
        btn.style.margin = '5px 0'
        btn.addEventListener('click', () => handleQuizAnswer(ans, correctAnswer))
        optionsContainer.appendChild(btn)
    })

    questionBox.appendChild(optionsContainer)
    
    // Lägg till en framstegsindikator
    const progress = document.createElement('p')
    progress.style.marginTop = '20px'
    progress.style.color = 'rgba(255,255,255,0.6)'
    progress.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`
    questionBox.appendChild(progress)

    quizCardContainer.appendChild(questionBox)
}

function handleQuizAnswer(selected, correct) {
    if (selected === correct) {
        quizScore++
        showToast("⭐ Correct!🎉", "success")
    } else {
        showToast(`⛔ Wrong! Correct was: ${correct} `, "error")
    }

    currentQuestionIndex++
    
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length) {
            renderQuizQuestion()
        } else {
            renderQuizResults()
        }
    }, 1000)
}

function renderQuizResults() {
    quizCardContainer.innerHTML = `
        <div class="quiz-results-box" style="text-align: center; color: white; padding: 30px;">
            <h2>Quiz Finished! 🏁</h2>
            <p style="font-size: 1.5rem; margin: 20px 0;">You scored <strong>${quizScore}</strong> out of <strong>${quizQuestions.length}</strong>!</p>
            <button id="btnFinishQuiz" class="category-card-btn" style="max-width: 350px; margin: 0 auto; display: block;">Back to Menu</button>
        </div>
    `
    document.getElementById('btnFinishQuiz').addEventListener('click', initQuizMainMenu)
}