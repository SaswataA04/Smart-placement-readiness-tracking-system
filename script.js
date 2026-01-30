// 1️⃣ Test user seed (top of file)
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([
    {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
      branch: 'CSE',
      year: '3',
      targetCompanies: ['Google', 'Amazon'],
      goalDate: '2026-12-31'
    }
  ]));
}

// 2️⃣ Storage manager (ONLY ONCE)
const Storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};




// Initialize App State
let currentUser = null;
let appData = {
    coding: [],
    aptitude: [],
    interviews: [],
    skills: [
        { name: 'Communication', rating: 0 },
        { name: 'Teamwork', rating: 0 },
        { name: 'Leadership', rating: 0 },
        { name: 'Presentation', rating: 0 },
        { name: 'Problem Solving', rating: 0 },
        { name: 'Time Management', rating: 0 }
    ],
    resumes: [],
    roadmap: [],
    lastActive: new Date().toDateString(),
    streak: 0,
    activeDays: [],
    assessments: [],     
recommendations: [],     
lastAssessmentDate: null

};

// Auth Functions
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('signupScreen').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signupScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = Storage.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        Storage.set('currentUser', user);
        loadUserData();
        showApp();
    } else {
        showNotification('Invalid email or password', 'error');
    }
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const users = Storage.get('users') || [];
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    currentUser = { name, email, password };
    document.getElementById('signupScreen').classList.add('hidden');
    document.getElementById('profileSetupScreen').classList.remove('hidden');
});

document.getElementById('profileSetupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    currentUser.branch = document.getElementById('branch').value;
    currentUser.year = document.getElementById('year').value;
    currentUser.targetCompanies = document.getElementById('targetCompanies').value.split(',').map(c => c.trim());
    currentUser.goalDate = document.getElementById('goalDate').value;
    currentUser.id = Date.now();
    
    const users = Storage.get('users') || [];
    users.push(currentUser);
    Storage.set('users', users);
    Storage.set('currentUser', currentUser);
    
    initializeUserData();
    showApp();
});

function showApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('signupScreen').classList.add('hidden');
    document.getElementById('profileSetupScreen').classList.add('hidden');
    document.getElementById('appContainer').style.display = 'block';

    updateUserInfo();

    // 🔁 Check if assessment is needed
    if (isAssessmentRequired()) {
        openAssessmentScreen();   // redirect user to test
        return;                   // stop dashboard load
    }

    updateDashboard();
    generateRoadmap();
    loadRecommendations();       // NEW
}





function isAssessmentRequired() {
    if (!appData.assessments || appData.assessments.length === 0) {
        return true; // first-time user
    }

    if (!appData.lastAssessmentDate) {
        return true; // corrupted or missing date safeguard
    }

    const last = new Date(appData.lastAssessmentDate);
    const today = new Date();

    const diffDays = Math.floor(
        (today - last) / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 15;
}



function openAssessmentScreen() {
    alert('Please complete your assessment to continue.');

    // Later you’ll replace this with an actual screen
    // switchScreen('assessment');
}
















function submitAssessment(scores) {
  const assessment = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...scores
  };

  appData.assessments.push(assessment);
  appData.lastAssessmentDate = assessment.date;

  generateRecommendations(assessment);
  appData.roadmap = generateInitialRoadmap();
  saveData();
  updateDashboard();
}






function updateUserInfo() {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userBranch').textContent = `${currentUser.branch}, ${currentUser.year}${currentUser.year == 1 ? 'st' : currentUser.year == 2 ? 'nd' : currentUser.year == 3 ? 'rd' : 'th'} Year`;
    
    // Populate settings
    document.getElementById('settingsName').value = currentUser.name;
    document.getElementById('settingsBranch').value = currentUser.branch;
    document.getElementById('settingsYear').value = currentUser.year;
    document.getElementById('settingsCompanies').value = currentUser.targetCompanies.join(', ');
    document.getElementById('cfHandle').value = currentUser.cfHandle || '';

}

function initializeUserData() {
    appData.roadmap = generateInitialRoadmap();
    saveData();
}



function generateRecommendations(assessment) {
  const recs = [];

  if (assessment.coding < 50) {
    recs.push({
      area: 'Coding',
      action: 'Solve 5 Easy + 3 Medium problems daily',
      priority: 'High'
    });
  }

  if (assessment.aptitude < 60) {
    recs.push({
      area: 'Aptitude',
      action: 'Attempt aptitude mock tests every 3 days',
      priority: 'Medium'
    });
  }

  if (assessment.logic < 50) {
    recs.push({
      area: 'Logical Reasoning',
      action: 'Practice reasoning sets for 30 mins daily',
      priority: 'Medium'
    });
  }

  if (assessment.softSkills < 60) {
    recs.push({
      area: 'Soft Skills',
      action: 'Record mock HR answers twice a week',
      priority: 'Low'
    });
  }

  appData.recommendations = recs;
}


function loadRecommendations() {
  const html = appData.recommendations.map(rec => `
    <div class="recommendation-card">
      <strong>${rec.area}</strong>
      <p>${rec.action}</p>
      <span class="priority ${rec.priority.toLowerCase()}">
        ${rec.priority} Priority
      </span>
    </div>
  `).join('');

  document.getElementById('recommendationList').innerHTML =
    html || '<p>No recommendations available</p>';
}






















function loadUserData() {
    const data = Storage.get(`appData_${currentUser.id}`);
    if (data) {
        appData = data;
        updateStreak();
    } else {
        initializeUserData();
    }
}

function saveData() {
    Storage.set(`appData_${currentUser.id}`, appData);
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastActive = appData.lastActive;
    
    if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
            appData.streak++;
        } else {
            appData.streak = 1;
        }
        
        appData.lastActive = today;
        if (!appData.activeDays.includes(today)) {
            appData.activeDays.push(today);
        }
        saveData();
    }
    
    document.getElementById('currentStreak').textContent = appData.streak;
    document.getElementById('consistencyStreak').textContent = appData.streak;
    
    const thisMonth = new Date().getMonth();
    const activeDaysThisMonth = appData.activeDays.filter(day => {
        return new Date(day).getMonth() === thisMonth;
    }).length;
    
    document.getElementById('activeDays').textContent = activeDaysThisMonth;
    
    const daysInMonth = new Date(new Date().getFullYear(), thisMonth + 1, 0).getDate();
    const consistencyScore = Math.round((activeDaysThisMonth / daysInMonth) * 100);
    document.getElementById('consistencyScore').textContent = consistencyScore + '%';
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const screen = item.dataset.screen;
        switchScreen(screen);
    });
});

function switchScreen(screenName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(`${screenName}Screen`).classList.add('active');
    
    const titles = {
        dashboard: 'Dashboard',
        coding: 'Coding Practice',
        aptitude: 'Aptitude Tracker',
        resume: 'Resume Manager',
        softskills: 'Soft Skills',
        interviews: 'Mock Interviews',
        roadmap: 'Personalized Roadmap',
        companies: 'Target Companies',
        consistency: 'Consistency Tracker',
        reports: 'Reports',
        settings: 'Settings'
    };
    
    document.getElementById('screenTitle').textContent = titles[screenName];
    
    if (screenName === 'coding') loadCodingData();
    if (screenName === 'aptitude') loadAptitudeData();
    if (screenName === 'softskills') loadSkillsData();
    if (screenName === 'interviews') loadInterviewData();
    if (screenName === 'roadmap') loadRoadmapData();
    if (screenName === 'companies') loadCompaniesData();
    if (screenName === 'resume') loadResumeData();
}








function updateDashboard() {
    const categories = [
        { name: 'Coding Practice', value: calculateCodingProgress() },
        { name: 'Aptitude', value: calculateAptitudeProgress() },
        { name: 'Resume', value: appData.resumes.length > 0 ? 80 : 0 },
        { name: 'Soft Skills', value: calculateSkillsProgress() },
        { name: 'Mock Interviews', value: calculateInterviewProgress() }
    ];

    const progressHtml = categories.map(cat => `
        <div class="progress-item">
            <div class="progress-header">
                <span class="progress-label">${cat.name}</span>
                <span class="progress-value">${cat.value}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${cat.value}%"></div>
            </div>
        </div>
    `).join('');

    document.getElementById('categoryProgress').innerHTML = progressHtml;

    // 🔹 Activity-based score
    const activityScore = Math.round(
        categories.reduce((sum, cat) => sum + cat.value, 0) / categories.length
    );

    // 🔹 Assessment-based score (NEW)
    let assessmentScore = 0;
    if (appData.assessments && appData.assessments.length > 0) {
        const latest = appData.assessments[appData.assessments.length - 1];
        assessmentScore = Math.round(
            (latest.coding + latest.aptitude + latest.logic + latest.softSkills) / 4
        );
    }

    // 🔹 Final readiness score (70% activity + 30% assessment)
    const overallScore = Math.round(
        (activityScore * 0.7) + (assessmentScore * 0.3)
    );

    document.getElementById('readinessValue').textContent = overallScore + '%';
    document.getElementById('readinessCircle')
        .style.setProperty('--score-deg', `${(overallScore / 100) * 360}deg`);

    loadWeeklyTasksPreview();
}





function calculateCodingProgress() {
    const total = appData.coding.length;
    return Math.min(100, total * 2);
}

function calculateAptitudeProgress() {
    if (appData.aptitude.length === 0) return 0;
    const avg = appData.aptitude.reduce((sum, test) => sum + test.score, 0) / appData.aptitude.length;
    return Math.round(avg);
}

function calculateSkillsProgress() {
    const totalRating = appData.skills.reduce((sum, skill) => sum + skill.rating, 0);
    const maxRating = appData.skills.length * 5;
    return Math.round((totalRating / maxRating) * 100);
}

function calculateInterviewProgress() {
    if (appData.interviews.length === 0) return 0;
    const avg = appData.interviews.reduce((sum, interview) => sum + parseInt(interview.rating), 0) / appData.interviews.length;
    return Math.round((avg / 5) * 100);
}

function loadWeeklyTasksPreview() {
    const tasks = appData.roadmap.slice(0, 5);
    const html = tasks.map(task => `
        <div class="roadmap-item">
            <input type="checkbox" class="roadmap-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="roadmap-text">
                <div style="font-weight: 600;">${task.title}</div>
            </div>
            <span class="roadmap-category">${task.category}</span>
        </div>
    `).join('');
    
    document.getElementById('weeklyTasksPreview').innerHTML = html || '<p style="color: var(--text-light);">No tasks available. Generate a roadmap!</p>';
}

// Coding Practice Functions
document.getElementById('addCodingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const platform = document.getElementById('codingPlatform').value;
    const difficulty = document.getElementById('codingDifficulty').value;
    const count = parseInt(document.getElementById('codingCount').value);
    
    for (let i = 0; i < count; i++) {
        appData.coding.push({
            id: Date.now() + i,
            platform,
            difficulty,
            date: new Date().toISOString()
        });
    }
    
    saveData();
    updateStreak();
    updateDashboard();
    loadCodingData();
    closeModal('addCodingModal');
    showNotification(`Added ${count} ${difficulty} problem(s)!`);
    document.getElementById('addCodingForm').reset();
});

function loadCodingData() {
    const total = appData.coding.length;
    const easy = appData.coding.filter(p => p.difficulty === 'Easy').length;
    const medium = appData.coding.filter(p => p.difficulty === 'Medium').length;
    const hard = appData.coding.filter(p => p.difficulty === 'Hard').length;
    
    document.getElementById('totalProblems').textContent = total;
    document.getElementById('easyProblems').textContent = easy;
    document.getElementById('mediumProblems').textContent = medium;
    document.getElementById('hardProblems').textContent = hard;
    
    const recent = appData.coding.slice(-10).reverse();
    const html = recent.map(problem => {
        const date = new Date(problem.date).toLocaleDateString();
        return `
            <div class="log-entry">
                <div class="log-header">
                    <span class="log-title">${problem.platform} - ${problem.difficulty}</span>
                    <span class="log-date">${date}</span>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('codingLogs').innerHTML = html || '<p style="color: var(--text-light);">No problems logged yet.</p>';
}

// Aptitude Functions
document.getElementById('addAptitudeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const testName = document.getElementById('aptitudeTestName').value;
    const score = parseInt(document.getElementById('aptitudeScore').value);
    const date = document.getElementById('aptitudeDate').value;
    
    appData.aptitude.push({
        id: Date.now(),
        testName,
        score,
        date
    });
    
    saveData();
    updateStreak();
    updateDashboard();
    loadAptitudeData();
    closeModal('addAptitudeModal');
    showNotification('Aptitude test added!');
    document.getElementById('addAptitudeForm').reset();
});

function loadAptitudeData() {
    const total = appData.aptitude.length;
    const avgScore = total > 0 
        ? Math.round(appData.aptitude.reduce((sum, test) => sum + test.score, 0) / total)
        : 0;
    
    document.getElementById('totalTests').textContent = total;
    document.getElementById('avgScore').textContent = avgScore + '%';
    
    const recent = appData.aptitude.slice(-10).reverse();
    const html = recent.map(test => {
        const date = new Date(test.date).toLocaleDateString();
        return `
            <div class="log-entry">
                <div class="log-header">
                    <span class="log-title">${test.testName}</span>
                    <span class="log-date">${date}</span>
                </div>
                <div style="margin-top: 8px; font-weight: 600; color: var(--primary);">
                    Score: ${test.score}%
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('aptitudeLogs').innerHTML = html || '<p style="color: var(--text-light);">No tests logged yet.</p>';
}

// Skills Functions
function loadSkillsData() {
    const html = appData.skills.map((skill, index) => `
        <div class="skill-item">
            <span style="font-weight: 600;">${skill.name}</span>
            <div class="rating-input">
                ${[1,2,3,4,5].map(rating => `
                    <button type="button" class="rating-btn ${skill.rating >= rating ? 'active' : ''}"
                            onclick="rateSkill(${index}, ${rating})">${rating}</button>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    document.getElementById('skillsList').innerHTML = html;
}

function rateSkill(index, rating) {
    appData.skills[index].rating = rating;
    saveData();
    updateDashboard();
    loadSkillsData();
}

// Interview Functions
document.getElementById('addInterviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const company = document.getElementById('interviewCompany').value;
    const questions = document.getElementById('interviewQuestions').value;
    const rating = document.getElementById('interviewRating').value;
    const date = document.getElementById('interviewDate').value;
    
    appData.interviews.push({
        id: Date.now(),
        company,
        questions,
        rating,
        date
    });
    
    saveData();
    updateStreak();
    updateDashboard();
    loadInterviewData();
    closeModal('addInterviewModal');
    showNotification('Interview logged!');
    document.getElementById('addInterviewForm').reset();
});

function loadInterviewData() {
    const recent = appData.interviews.slice(-10).reverse();
    const html = recent.map(interview => {
        const date = new Date(interview.date).toLocaleDateString();
        const stars = '⭐'.repeat(parseInt(interview.rating));
        return `
            <div class="log-entry">
                <div class="log-header">
                    <span class="log-title">${interview.company}</span>
                    <span class="log-date">${date}</span>
                </div>
                <div style="margin: 8px 0; color: var(--text-light);">${interview.questions}</div>
                <div class="rating-stars">${stars}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('interviewLogs').innerHTML = html || '<p style="color: var(--text-light);">No interviews logged yet.</p>';
}

// Roadmap Functions
function generateInitialRoadmap() {
  if (appData.recommendations.length === 0) {
    return [
      { id: 1, category: 'General', title: 'Complete preliminary assessment', completed: false }
    ];
  }

  return appData.recommendations.map((rec, index) => ({
    id: Date.now() + index,
    category: rec.area,
    title: rec.action,
    completed: false
  }));
}


function loadRoadmapData() {
    const html = appData.roadmap.map(task => `
        <div class="roadmap-item">
            <input type="checkbox" class="roadmap-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="roadmap-text">
                <div style="font-weight: 600; ${task.completed ? 'text-decoration: line-through; color: var(--text-light);' : ''}">${task.title}</div>
            </div>
            <span class="roadmap-category">${task.category}</span>
        </div>
    `).join('');
    
    document.getElementById('roadmapTasks').innerHTML = html;
}

function toggleTask(taskId) {
    const task = appData.roadmap.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        updateStreak();
        loadRoadmapData();
        loadWeeklyTasksPreview();
    }
}

function regenerateRoadmap() {
    if (confirm('This will create a new roadmap. Continue?')) {
        appData.roadmap = generateInitialRoadmap();
        saveData();
        loadRoadmapData();
        showNotification('Roadmap regenerated!');
    }
}

function generateRoadmap() {
    if (appData.roadmap.length === 0) {
        appData.roadmap = generateInitialRoadmap();
        saveData();
    }
}

// Resume Functions
function uploadResume() {
    const file = document.getElementById('resumeInput').files[0];
    if (file && file.type === 'application/pdf') {
        appData.resumes.push({
            id: Date.now(),
            name: file.name,
            uploadDate: new Date().toISOString(),
            atsScore: Math.floor(Math.random() * 30) + 70
        });
        
        saveData();
        updateDashboard();
        loadResumeData();
        showNotification('Resume uploaded successfully!');
    } else {
        showNotification('Please upload a PDF file', 'error');
    }
}

function loadResumeData() {
    const html = appData.resumes.map(resume => {
        const date = new Date(resume.uploadDate).toLocaleDateString();
        return `
            <div class="resume-item">
                <div>
                    <div style="font-weight: 600;">${resume.name}</div>
                    <div style="font-size: 14px; color: var(--text-light);">
                        Uploaded: ${date} | ATS Score: ${resume.atsScore}%
                    </div>
                </div>
                <button class="btn btn-small btn-danger" onclick="deleteResume(${resume.id})">Delete</button>
            </div>
        `;
    }).join('');
    
    document.getElementById('resumeList').innerHTML = html;
}

function deleteResume(id) {
    if (confirm('Delete this resume?')) {
        appData.resumes = appData.resumes.filter(r => r.id !== id);
        saveData();
        updateDashboard();
        loadResumeData();
        showNotification('Resume deleted');
    }
}

// Companies Functions
function loadCompaniesData() {
    const html = currentUser.targetCompanies.map(company => `
        <div class="company-card">
            <h4 style="margin-bottom: 8px;">🏢 ${company}</h4>
            <p style="color: var(--text-light); font-size: 14px;">
                Recommended focus: Coding (40%), Aptitude (30%), Interview (30%)
            </p>
        </div>
    `).join('');
    
    document.getElementById('companiesList').innerHTML = html;
}

// Settings Functions
document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    currentUser.name = document.getElementById('settingsName').value;
    currentUser.branch = document.getElementById('settingsBranch').value;
    currentUser.year = document.getElementById('settingsYear').value;
    currentUser.targetCompanies = document.getElementById('settingsCompanies').value.split(',').map(c => c.trim());
    currentUser.cfHandle = document.getElementById('cfHandle').value.trim();


Storage.set('currentUser', currentUser);

    const users = Storage.get('users');
    const index = users.findIndex(u => u.id === currentUser.id);
    users[index] = currentUser;
    Storage.set('users', users);
   
    
    updateUserInfo();
    showNotification('Settings saved!');
});

function resetData() {
    if (confirm('Are you sure? This will delete all your progress data.')) {
        appData = {
            coding: [],
            aptitude: [],
            interviews: [],
            skills: appData.skills.map(s => ({ ...s, rating: 0 })),
            resumes: [],
            roadmap: [],
            lastActive: new Date().toDateString(),
            streak: 0,
            activeDays: [],
            assessments: [],
recommendations: [],
lastAssessmentDate: null,

        };
        
        saveData();
        updateDashboard();
        showNotification('All data reset');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        Storage.remove('currentUser');
        location.reload();
    }
}

// Reports Functions
function downloadReport() {
    const reportData = {
        name: currentUser.name,
        branch: currentUser.branch,
        year: currentUser.year,
        readinessScore: document.getElementById('readinessValue').textContent,
        coding: appData.coding.length,
        aptitude: appData.aptitude.length,
        interviews: appData.interviews.length,
        streak: appData.streak
    };
    
    alert('Report generation would happen here. In production, this would create a downloadable PDF with all your stats and progress charts.');
    showNotification('Report generated!');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Notification Function
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = type === 'error' ? 'var(--danger)' : 'var(--secondary)';
    notification.style.color = 'white';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}






// Check if user is already logged in
window.addEventListener('load', () => {
    const savedUser = Storage.get('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData();
        showApp();
    }
});






async function syncCodeforces() {
    console.log('Sync button clicked'); // 🔍 debug line

    const handle = currentUser?.cfHandle;

    if (!handle) {
        showNotification('Please set your Codeforces handle in Settings', 'error');
        return;
    }

    try {
        showNotification('Fetching Codeforces data...');

        const res = await fetch(
            `https://codeforces.com/api/user.status?handle=${handle}`
        );

        const data = await res.json();
        console.log(data); // 🔍 debug

        if (data.status !== 'OK') {
            throw new Error('Invalid handle');
        }

        const solved = new Set();

        data.result.forEach(sub => {
            if (sub.verdict === 'OK') {
                solved.add(sub.problem.contestId + sub.problem.index);
            }
        });

        const existing = appData.coding.filter(p => p.platform === 'Codeforces').length;
        const toAdd = Math.max(0, solved.size - existing);

        for (let i = 0; i < toAdd; i++) {
            appData.coding.push({
                id: Date.now() + i,
                platform: 'Codeforces',
                difficulty: 'Medium',
                date: new Date().toISOString()
            });
        }

        saveData();
        updateDashboard();
        loadCodingData();

        showNotification(`Synced ${toAdd} Codeforces problems`);
    } catch (e) {
        console.error(e);
        showNotification('Failed to sync Codeforces', 'error');
    }
}

