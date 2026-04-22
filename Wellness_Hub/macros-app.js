let currentGoal = 'maintain';
let currentPreset = 'balanced';

const presets = {
    balanced: { p: 30, c: 40, f: 30 },
    highProtein: { p: 40, c: 30, f: 30 },
    keto: { p: 35, c: 5, f: 60 }
};

function setGoal(goal) {
    currentGoal = goal;
    document.querySelectorAll('.btn-group')[0].querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(goal)) btn.classList.add('active');
    });
    document.getElementById('targetWeightSection').style.display = (goal === 'maintain') ? 'none' : 'block';
    calculateAll();
}

function setPreset(preset) {
    currentPreset = preset;
    document.querySelectorAll('.btn-group')[1].querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(preset.toLowerCase().replace('high',''))) btn.classList.add('active');
    });
    calculateAll();
}

function calculateAll() {
    const sex = document.getElementById('bioSex').value;
    const age = parseInt(document.getElementById('bioAge').value);
    const weightLb = parseFloat(document.getElementById('bioWeight').value);
    
    // NEW: Feet/Inches conversion
    const heightFt = parseFloat(document.getElementById('bioHeightFt').value) || 0;
    const heightIn = parseFloat(document.getElementById('bioHeightIn').value) || 0;
    const totalInches = (heightFt * 12) + heightIn;
    
    const activity = parseFloat(document.getElementById('activityLevel').value);

    // Formula Conversion
    const weightKg = weightLb * 0.453592;
    const heightCm = totalInches * 2.54;

    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr = (sex === 'male') ? bmr + 5 : bmr - 161;

    let tdee = bmr * activity;
    let targetCalories = tdee;
    let timelineText = "STABLE STATE";

    if (currentGoal !== 'maintain') {
        const targetWeight = parseFloat(document.getElementById('targetWeight').value);
        const rate = parseFloat(document.getElementById('weeklyRate').value);
        const weightDiff = Math.abs(targetWeight - weightLb);
        const dailyAdjustment = (rate * 3500) / 7;
        
        if (currentGoal === 'cut') {
            targetCalories = tdee - dailyAdjustment;
        } else {
            targetCalories = tdee + dailyAdjustment;
        }
        
        timelineText = `EST. ${Math.ceil(weightDiff / rate)} WEEKS TO TARGET`;
        document.getElementById('rateWarning').style.display = (rate >= 1.5) ? 'block' : 'none';
    }

    const pPct = presets[currentPreset].p / 100;
    const cPct = presets[currentPreset].c / 100;
    const fPct = presets[currentPreset].f / 100;

    const gPro = Math.round((targetCalories * pPct) / 4);
    const gCarb = Math.round((targetCalories * cPct) / 4);
    const gFat = Math.round((targetCalories * fPct) / 9);

    document.getElementById('resCalories').innerText = Math.round(targetCalories);
    document.getElementById('resTimeline').innerText = timelineText;

    document.getElementById('barPro').style.width = (pPct * 100) + "%";
    document.getElementById('barCarb').style.width = (cPct * 100) + "%";
    document.getElementById('barFat').style.width = (fPct * 100) + "%";

    document.getElementById('labelPro').innerText = `${gPro}g (${presets[currentPreset].p}%)`;
    document.getElementById('labelCarb').innerText = `${gCarb}g (${presets[currentPreset].c}%)`;
    document.getElementById('labelFat').innerText = `${gFat}g (${presets[currentPreset].f}%)`;
}

calculateAll();
