// ==========================================================================
// MAIN ENGINE
// ==========================================================================

// VIEW NAVIGATION & INITIAL STATE
const studyBtn = document.getElementById('studyBtn')
const quizBtn = document.getElementById('quizBtn')
const homeLink = document.getElementById('homeLink')
const studyLink = document.getElementById('studyLink')
const quizLink = document.getElementById('quizLink')
const savedLink = document.getElementById('savedLink')

const startMenu = document.getElementById('startMenu')
const studyView = document.getElementById('studyView')
const quizView = document.getElementById('quizView')
const savedView = document.getElementById('savedView')

const views = [startMenu, studyView, quizView, savedView]

function showView(view) {
    views.forEach(v => v.classList.add('hidden'))
    view.classList.remove('hidden')
}

studyBtn.addEventListener('click', () => showView(studyView))
quizBtn.addEventListener('click', () => { showView(quizView); initQuizMainMenu(); })
homeLink.addEventListener('click', () => showView(startMenu))
studyLink.addEventListener('click', () => showView(studyView))
quizLink.addEventListener('click', () => { showView(quizView); initQuizMainMenu(); })
savedLink.addEventListener('click', () => {
    showView(savedView)
    updateSavedCounters()
    document.getElementById('savedCategoryMenu').classList.remove('hidden')
    document.getElementById('savedListContent').classList.add('hidden')
}) 

const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const clearSearchBtn = document.getElementById('clearSearchBtn')
const quizCardContainer = document.getElementById('quizCardContainer')
const countryCardContainer = document.getElementById('countryCardContainer')

// TOAST NOTIS-SYSTEM
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'toast-container'
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;'
        document.body.appendChild(container)
    }
    const toast = document.createElement('div')
    toast.textContent = message
    const bg = type === 'success' ? '#2ecc71' : type === 'warning' ? '#f39c12' : '#e74c3c'
    toast.style.cssText = `background-color: ${bg}; color: white; padding: 12px 24px; border-radius: 8px; font-family: sans-serif; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transform: translateY(20px); transition: all 0.3s ease;`
    container.appendChild(toast)
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10)
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

// API CALLS
const getAllCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages,currencies,area,maps')
    if (!response.ok) throw new Error("Could not fetch world data.")
    return await response.json()
}

let allCountries = []

// DROPDOWNS & FILTER LOGIK
const filterToggle = document.getElementById('filterToggle')
const filterMenu = document.getElementById('filterMenu')
const sortToggle = document.getElementById('sortToggle')
const sortMenu = document.getElementById('sortMenu')
const sortOptions = document.querySelectorAll('.sortOption')

const countriesTab = document.getElementById('countriesTab')
const regionsTab = document.getElementById('regionsTab')
const languagesTab = document.getElementById('languagesTab')
const countriesPanel = document.getElementById('countriesPanel')
const regionsPanel = document.getElementById('regionsPanel')
const languagesPanel = document.getElementById('languagesPanel')

const regionCheckboxes = document.getElementById('regionCheckboxes')
const languageCheckboxes = document.getElementById('languageCheckboxes')
const countryCheckboxes = document.getElementById('countryCheckboxes')
const selectAllCountriesBtn = document.getElementById('selectAllCountries')
const closeMenuBtn = document.getElementById('closeMenuBtn')

function closeAllMenus() {
    filterMenu.classList.add('hidden')
    sortMenu.classList.add('hidden')
    countriesPanel.classList.add('hidden')
    regionsPanel.classList.add('hidden')
    languagesPanel.classList.add('hidden')
    closeMenuBtn.classList.add('hidden')
}

filterToggle.addEventListener('click', () => {
    filterMenu.classList.toggle('hidden')
    sortMenu.classList.add('hidden')
    closeMenuBtn.classList.remove('hidden')
})

sortToggle.addEventListener('click', () => {
    sortMenu.classList.toggle('hidden')
    filterMenu.classList.add('hidden')
})

closeMenuBtn.addEventListener('click', closeAllMenus)

function showPanel(panelToShow) {
    countriesPanel.classList.add('hidden')
    regionsPanel.classList.add('hidden')
    languagesPanel.classList.add('hidden')
    panelToShow.classList.remove('hidden')
}

countriesTab.addEventListener('click', () => {
    showPanel(countriesPanel)
    if (!document.getElementById('countryFilterSearch')) {
        const searchBar = document.createElement('input')
        searchBar.id = 'countryFilterSearch'
        searchBar.type = 'text'
        searchBar.placeholder = '🔍 Search countries...'
        searchBar.style.cssText = 'width: 90%; padding: 8px; margin: 10px; border-radius: 6px; border: 1px solid #ccc; display: block; color: black;'
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase()
            const labels = countryCheckboxes.querySelectorAll('label')
            labels.forEach(label => {
                const text = label.textContent.toLowerCase()
                label.style.display = text.includes(term) ? 'block' : 'none'
            })
        })
        countriesPanel.insertBefore(searchBar, countryCheckboxes)
    }
    renderCountryCheckboxes(allCountries)
})

selectAllCountriesBtn.addEventListener('click', () => {
    const checkboxes = countryCheckboxes.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = true);
    applyFilters(); 
})

regionsTab.addEventListener('click', () => {
    showPanel(regionsPanel)
    renderRegionCheckboxes()
})

const renderRegionCheckboxes = () => {
    const currentlyChecked = Array.from(regionCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    regionCheckboxes.innerHTML = ''
    const regions = new Set(allCountries.map(c => c.region).filter(r => r))
    regions.forEach(region => {
        const isChecked = currentlyChecked.includes(region)
        const label = document.createElement('label')
        label.style.display = 'block'
        label.innerHTML = `<input type="checkbox" value="${region}" ${isChecked ? 'checked' : ''}> ${region}`
        regionCheckboxes.appendChild(label)
    })
}

languagesTab.addEventListener('click', () => {
    showPanel(languagesPanel)
    if (!document.getElementById('languageFilterSearch')) {
        const searchBar = document.createElement('input')
        searchBar.id = 'languageFilterSearch'
        searchBar.type = 'text'
        searchBar.placeholder = '🔍 Search languages...'
        searchBar.style.cssText = 'width: 90%; padding: 8px; margin: 10px; border-radius: 6px; border: 1px solid #ccc; display: block; color: black;'
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase()
            const labels = languageCheckboxes.querySelectorAll('label')
            labels.forEach(label => {
                const text = label.textContent.toLowerCase()
                label.style.display = text.includes(term) ? 'block' : 'none'
            })
        })
        languagesPanel.insertBefore(searchBar, languageCheckboxes)
    }
    renderLanguageCheckboxes(allCountries)
})

const renderLanguageCheckboxes = (countries) => {
    const currentlyChecked = Array.from(languageCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    languageCheckboxes.innerHTML = ''
    const languages = new Set() 
    countries.forEach(country => {
        if (country.languages) { 
            Object.values(country.languages).forEach(lang => languages.add(lang))
        }
    })
    Array.from(languages).sort().forEach(lang => {
        const isChecked = currentlyChecked.includes(lang)
        const label = document.createElement('label')
        label.style.display = 'block'
        label.innerHTML = `<input type="checkbox" value="${lang}" ${isChecked ? 'checked' : ''}> ${lang}`
        languageCheckboxes.appendChild(label)
    })
}   


const applyFilters = () => {
    const selectedCountries = Array.from(countryCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    const selectedRegions = Array.from(regionCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    const selectedLanguages = Array.from(languageCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)

    if (selectedCountries.length === 0 && selectedRegions.length === 0 && selectedLanguages.length === 0) {
        renderCountryCard(allCountries)
        return
    }

    const filteredCountries = allCountries.filter(country => {
        const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(country.name.common)
        const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(country.region)
        let matchesLanguage = selectedLanguages.length === 0
        if (selectedLanguages.length > 0 && country.languages) {
            const countryLanguages = Object.values(country.languages)
            matchesLanguage = selectedLanguages.some(lang => countryLanguages.includes(lang))
        }
        return matchesCountry && matchesRegion && matchesLanguage
    })
    renderCountryCard(filteredCountries)
}

regionCheckboxes.addEventListener('change', applyFilters)
languageCheckboxes.addEventListener('change', applyFilters)
countryCheckboxes.addEventListener('change', applyFilters) // Flyttad hit!

sortOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const sortType = btn.dataset.sort
        let sorted = [...allCountries]
        if (sortType === 'name-asc') sorted.sort((a, b) => a.name.common.localeCompare(b.name.common))
        if (sortType === 'name-desc') sorted.sort((a, b) => b.name.common.localeCompare(a.name.common))
        if (sortType === 'population-asc') sorted.sort((a, b) => a.population - b.population)
        if (sortType === 'population-desc') sorted.sort((a, b) => b.population - a.population)
        if (sortType === 'area-asc') sorted.sort((a, b) => a.area - b.area)
        if (sortType === 'area-desc') sorted.sort((a, b) => b.area - a.area)
        renderCountryCard(sorted)
        sortMenu.classList.add('hidden')
    })
})

// RENDER CARD ENGINE
const getCleanCountryData = (country) => {
    return {
        name: country.name?.common || 'Unknown',
        flag: country.flags?.png || 'https://via.placeholder.com/300x200?text=No+Flag',
        capital: country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A',
        region: country.region || 'N/A',
        languages: country.languages && Object.keys(country.languages).length > 0 ? Object.values(country.languages).join(', ') : 'N/A',
        currencies: country.currencies && Object.keys(country.currencies).length > 0 ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A',
        population: country.population !== undefined ? country.population.toLocaleString() : 'N/A',
        area: country.area !== undefined ? country.area.toLocaleString() : 'N/A',
        maps: country.maps?.googleMaps || '#'
    }
}

const renderCountryCard = (countries) => {
    countryCardContainer.innerHTML = ''
    if (!countries || countries.length === 0) {
        countryCardContainer.innerHTML = '<p class="error-msg">No countries matched your criteria. 🕵️‍♂️</p>'
        return
    }

    countries.forEach(country => {
        const cleanData = getCleanCountryData(country)
        const cardContainer = document.createElement('div')
        cardContainer.classList.add('flip-card')
        cardContainer.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${cleanData.flag}" alt="Flag of ${cleanData.name}" class="card-map-img" loading="lazy">
                    <h3>${cleanData.name}</h3>
                    <p>${cleanData.region}</p>
                </div>
                <div class="flip-card-back">
                    <img src="${cleanData.flag}" alt="Flag of ${cleanData.name}" class="card-stamp-flag" loading="lazy">
                    <h3>${cleanData.name}</h3>
                    <p><strong>Capital:</strong> ${cleanData.capital}</p>
                    <p><strong>Region:</strong> ${cleanData.region}</p>
                    <p><strong>Languages:</strong> ${cleanData.languages}</p>
                    <p><strong>Currency:</strong> ${cleanData.currencies}</p>
                    <p><strong>Population:</strong> ${cleanData.population}</p>
                    <p><strong>Area:</strong> ${cleanData.area} km²</p>
                    <a href="${cleanData.maps}" target="_blank" rel="noopener">View on Google Maps ↗</a>
                    <div class="card-actions">
                        <button class="btn-save-study">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                            Send to studylist! 
                        </button>
                        <button class="btn-save-quiz">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                            Send to quizpool!
                        </button> 
                        <button class="btn-quiz-now">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                            Quiz now!
                        </button>
                    </div>
                </div>
            </div>
        `
        cardContainer.addEventListener('click', function() { this.classList.toggle('flipped') })
        cardContainer.querySelector('.btn-save-study').addEventListener('click', (e) => { e.stopPropagation(); addToStudyList(country); })
        cardContainer.querySelector('.btn-save-quiz').addEventListener('click', (e) => { e.stopPropagation(); addToQuizList(country); })
        cardContainer.querySelector('.btn-quiz-now').addEventListener('click', (e) => { e.stopPropagation(); quizNow(country); })
        countryCardContainer.appendChild(cardContainer)
    })
}

const renderCountryCheckboxes = (countries) => {
    const currentlyChecked = Array.from(countryCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    countryCheckboxes.innerHTML = ''
    const sorted = [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common))
    sorted.forEach(country => {
        const name = country.name.common
        const isChecked = currentlyChecked.includes(name)
        const label = document.createElement('label')
        label.style.display = 'block'
        label.innerHTML = `<input type="checkbox" value="${name}" ${isChecked ? 'checked' : ''}> ${name}`
        countryCheckboxes.appendChild(label)
    })
}

// INITIAL APPLICATION LOAD
const initApp = async () => {
    try {
        countryCardContainer.innerHTML = "<div class='spinner-container'><div class='loading-spinner'></div></div>"
        allCountries = await getAllCountries()
        renderCountryCheckboxes(allCountries)
        renderCountryCard(allCountries)
        updateSavedCounters()
    } catch (error) {
        countryCardContainer.innerHTML = '<p class="error-msg">Could not connect to the world database. Please try reloading the page. 💥</p>'
    }
}

initApp()

// SEARCH HANDLING & CLEAN
const handleSearch = async () => {
    const value = searchInput.value.trim().toLowerCase()
    
    if (!value) {
        countryCardContainer.innerHTML = '<p class="error-msg">Search field cannot be empty. Please type a country name! 🗺️</p>'
        showToast("Hello? Type something in first! 🔮", "warning")
        return
    }
    
    try {
        countryCardContainer.innerHTML = "<div class='spinner-container'><div class='loading-spinner'></div></div>"
        
        console.log(`🔍 [API CALL] Fetching specific country data from: https://restcountries.com/v3.1/name/${value}`);
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${value}`)
        if (!response.ok) throw new Error("Check your grammar baby – that country doesn't exist! 🗺️🤷‍♂️")
        
        const result = await response.json()
        renderCountryCard(result)
    } catch (error) {
        countryCardContainer.innerHTML = `<p class="error-msg">${error.message}</p>`
        showToast(error.message, 'error')
    }
}

searchBtn.addEventListener('click', handleSearch)
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSearch() })


clearSearchBtn.addEventListener('click', () => {
    searchInput.value = ''
    
    const internalCountrySearch = document.getElementById('countryFilterSearch')
    const internalLanguageSearch = document.getElementById('languageFilterSearch')
    if(internalCountrySearch) internalCountrySearch.value = ''
    if(internalLanguageSearch) internalLanguageSearch.value = ''

    const allCbs = filterMenu.querySelectorAll('input[type="checkbox"]')
    allCbs.forEach(cb => cb.checked = false)

    const allLabels = filterMenu.querySelectorAll('label')
    allLabels.forEach(label => label.style.display = 'block')

    renderCountryCard(allCountries)
    showToast("Workspace cleared! 🔄", "info")
})