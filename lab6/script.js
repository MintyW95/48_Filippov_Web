let bets = [];
const citySearchMap = 
{
    "Reykjavík": "Reykjavik", "Kópavogur": "Kopavogur", "Hafnarfjörður": "Hafnarfjordur",
    "Reykjanesbær": "Reykjanesbaer", "Akureyri": "Akureyri", "Garðabær": "Gardabaer",
    "Mosfellsbær": "Mosfellsbaer", "Árborg": "Arborg", "Akranes": "Akranes",
    "Seltjarnarnes": "Seltjarnarnes", "Vestmannaeyjar": "Vestmannaeyjar", "Grindavík": "Grindavik",
    "Ísafjörður": "Isafjordur", "Húsavík": "Husavik", "Egilsstaðir": "Egilsstadir",
    "Borgarnes": "Borgarnes", "Seyðisfjörður": "Seydisfjordur", "Höfn": "Hofn",
    "Sauðárkrókur": "Saudarkrokur", "Siglufjörður": "Siglufjordur", "Ólafsvík": "Olafsvik",
    "Vík í Mýrdal": "Vik", "Blönduós": "Blonduos", "Dalvík": "Dalvik",
    "Hella": "Hella", "Hvolsvöllur": "Hvolsvollur", "Stykkishólmur": "Stykkisholmur",
    "Patreksfjörður": "Patreksfjordur", "Bolungarvík": "Bolungarvik", "Fáskrúðsfjörður": "Faskrudsfjordur"
};
const icelandCities = Object.keys(citySearchMap);
const weatherTypes = ["☀️","🌤️", "⛅", "☁️","🌫️","🌧️", "🌦️","❄️","⛈️"];

document.querySelectorAll('nav a').forEach(link => 
{
    link.addEventListener('click', (e) => 
    {
        e.preventDefault();
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        const sectionId = link.getAttribute('data-section');
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
        link.classList.add('active');
    });
});

async function loadBets() 
{
    bets = await StorageManager.getBets();
    if (bets.length === 0) 
    {
        console.log("изучаем экономическую ситуацию в Исланди......");
        const fakeBets = await generateFakeBets(); 
        for (const bet of fakeBets) 
        {
            await StorageManager.addBet(bet);
        }
        bets = await StorageManager.getBets();
    }
    renderBets();
}

async function placeBet() 
{
    const city = document.getElementById('betCitySelect').value;
    const predicted = document.getElementById('betWeatherSelect').value;
    if (!predicted) 
    {
        alert("saar выберите погоду saar");
        return;
    }
    const newBet = 
    {
        city: city || "Reykjavík",
        predicted: predicted,
        status: "принято",
        date: new Date().toLocaleDateString('ru-RU'),
        isOwn: true
    };
    const createdBet = await StorageManager.addBet(newBet);
    if (createdBet) 
    {
        bets.unshift(createdBet);
        renderBets();
        alert("ставка принята!");
    } 
    else 
    {
        alert("ошибка при создании ставки");
    }
}

async function generateFakeBets() 
{
    try 
    {
        const res = await fetch(`https://fakerapi.it/api/v2/persons?_quantity=${icelandCities.length * 3}&_locale=ru_RU`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const fakes = [];
        data.data.forEach((_, index) => {
            const city = icelandCities[index % icelandCities.length];
            fakes.push({
                id: `fake_${Date.now()}_${index}`,
                city: city,
                predicted: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
                status: ["выиграно", "проиграно"][Math.floor(Math.random() * 2)],
                date: new Date(Date.now() - Math.random() * 2592000000).toLocaleDateString('ru-RU'), //это месяц в мс
                isOwn: false
            });
        });
        return fakes;
    } 
    catch (e) 
    {
        console.error("ошибка доступа к fakerapi");
    }
}

window.updateBet = async function(id) 
{
    const bet = bets.find(b => b.id === id);
    if (!bet || !bet.isOwn) return;
    let message = `изменить прогноз для ${bet.city}\n`;
    weatherTypes.forEach((emoji, index) => 
    {
        message += `${index + 1}. ${emoji}\n`;
    });
    const input = prompt(message);
    if (input === null) return;
    const num = parseInt(input.trim());
    if (num < 1 || num > weatherTypes.length) 
    {
        alert("НЕ ТО");
        return;
    }
    const newPredicted = weatherTypes[num - 1];
    const updated = await StorageManager.updateBet(id, { predicted: newPredicted });
    if (updated) 
    {
        bet.predicted = newPredicted;
        renderBets();
        alert("прогноз обновлён");
    } 
    else 
    {
        alert("прогноз не был обновлён по техническим причинам");
    }
};

window.deleteBet = async function(id) 
{
    const bet = bets.find(b => b.id === id);
    if (!bet || !bet.isOwn) return;
    if (!confirm("отменить ставку?")) return;
    const success = await StorageManager.deleteBet(id);
    if (success) 
    {
        bets = bets.filter(b => b.id !== id);
        renderBets();
        alert("ставка отменена");
    } 
    else 
    {
        alert("технические неполадки: ставка Still Standing - Elton John");
    }
};

function renderBets() 
{
    const container = document.getElementById('betsList');
    if (bets.length === 0) 
    {
        container.innerHTML = `<p>стань первым</p>`;
        return;
    }
    container.innerHTML = bets.map(bet => 
    `
        <div class="card bet-card">
            <h3>${bet.city}</h3>
            <p><strong>Прогноз:</strong> ${bet.predicted}</p>
            <p><small>${bet.date}</small></p>
            <p>Статус: <span style="color:${bet.status === "выиграно" ? "lightgreen" : bet.status === "проиграно" ? "red" : "tomato"}">${bet.status}</span></p>
            ${bet.isOwn ? `
            <div class="bet-actions">
                <button onclick="updateBet('${bet.id}')">✏️</button>
                <button onclick="deleteBet('${bet.id}')">🗑️</button>
            </div>` : ''}
        </div>
    `).join('');
}

async function resetAllData() 
{
    if (!confirm("обрушить рынок ставок на погоду в Исландии???")) return;
    const ownBets = bets.filter(b => b.isOwn);
    for (const bet of ownBets) 
    {
        await StorageManager.deleteBet(bet.id);
    }
    loadBets();
}

async function fetchCurrentWeather() 
{
    let displayCity = document.getElementById('citySelect').value || "Reykjavík";
    let searchCity = citySearchMap[displayCity] || displayCity;
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.innerHTML = `<div class="loading">загружаем погоду для ${displayCity}</div>`;
    try 
    {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=5&language=en`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) 
        {
            throw new Error(`город не найден`);
        }
        const location = geoData.results[0];
        const { latitude, longitude } = location;
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`);
        if (!weatherRes.ok) throw new Error("ошибка погодного сервиса");
        const data = await weatherRes.json();
        const code = data.current.weather_code;
        const emojiMap = 
        {
            0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
            45: "🌫️", 48: "🌫️",
            51: "🌧️", 53: "🌧️", 55: "🌧️",
            61: "🌧️", 63: "🌧️", 65: "🌧️",
            71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️",
            80: "🌦️", 81: "🌦️", 82: "🌦️",
            85: "❄️", 86: "❄️",
            95: "⛈️", 96: "⛈️", 99: "⛈️"
        };
        const emoji = emojiMap[code] !== undefined ? emojiMap[code] : "❓";
        resultDiv.innerHTML = 
        `
            <div class="card weather-card">
                <div class="emoji" style="font-size:64px">${emoji}</div>
                <h3>${displayCity}, Исландия</h3>
            </div>
        `;
    } 
    catch (e) 
    {
        console.error(e);
        resultDiv.innerHTML = `<div class="error">не получилось загрузить погоду для ${displayCity}</div>`;
    }
}

async function fetchCurrencyRates() 
{
    const resultDiv = document.getElementById('currencyResult');
    resultDiv.innerHTML = `<div class="loading">проникаем на биржу...</div>`;
    try 
    {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        let html = `<div class="card"><h3>1 USD =</h3><table>`;
        html += `<tr><th>Валюта</th><th>Курс</th></tr>`;
        Object.entries(data.rates).slice(0, 20).forEach(([cur, rate]) => 
        {
            html += `<tr><td>${cur}</td><td>${rate.toFixed(2)}</td></tr>`;
        });
        html += `</table></div>`;
        resultDiv.innerHTML = html;
    } 
    catch (e) 
    {
        resultDiv.innerHTML = `<p class="error">мировая экономика обрушена</p>`;
    }
}

let isRunning = false;
function spinSlot() 
{
    if (isRunning === true) return;
    isRunning = true;
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const resultDiv = document.getElementById('slotResult');
    resultDiv.textContent = "штош...";
    slot1.textContent = "❓";
    slot2.textContent = "❓";
    slot3.textContent = "❓";
    setTimeout(() => { slot1.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];}, 300);
    setTimeout(() => { slot2.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];}, 600);
    setTimeout(() => { slot3.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]; showResult(); isRunning = false}, 900);
}

function showResult() 
{
    const s1 = document.getElementById('slot1').textContent;
    const s2 = document.getElementById('slot2').textContent;
    const s3 = document.getElementById('slot3').textContent;
    const resultDiv = document.getElementById('slotResult');
    if (s1 === s2 && s2 === s3) {resultDiv.innerHTML = `завтра точно будет ${s1}, ДЕПАЙ ВСЁ`;} 
    else if (s1 === s2 || s1 === s3) {resultDiv.innerHTML = `скорее всего будет ${s1}`;} 
    else if (s2 === s3) {resultDiv.innerHTML = `скорее всего будет ${s2}`;} 
    else {resultDiv.textContent = "ну чё сказать... погода в Исландии непредсказуема";} //пытался через switch(any) сделать, но оно ломалось
}

window.onload = () => 
{
    const citySelectBet = document.getElementById('betCitySelect');
    icelandCities.forEach(city => 
    {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelectBet.appendChild(option);
    });
    const weatherSelect = document.getElementById('betWeatherSelect');
    weatherTypes.forEach(pred => 
    {
        const option = document.createElement('option');
        option.value = pred;
        option.textContent = pred;
        weatherSelect.appendChild(option);
    });
    const citySelectWeather = document.getElementById('citySelect');
    if (citySelectWeather) 
    {
        icelandCities.forEach(city => 
        {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelectWeather.appendChild(option);
        });
        citySelectWeather.value = "Reykjavík";
    }
    const firstLink = document.querySelector('nav a[data-section="bets"]');
    if (firstLink) firstLink.classList.add('active');
    document.getElementById('bets').classList.add('active');
    loadBets();
};