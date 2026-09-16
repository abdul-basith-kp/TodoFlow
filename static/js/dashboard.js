


async function getStatistics() {
    const response = await fetch('http://127.0.0.1:5000/task-statistics')
    if (!response.ok){
        throw new Error("failed to fetch statistics")
    }
    const data = await response.json()
    return data
}

async function loadDashboard() {

    const completedCount = document.querySelector('.completed-count');
    const pendingCount = document.querySelector('.pending-count');
    const deletedCount = document.querySelector('.deleted-count');

    const completedPercent = document.querySelector('.completed-percent');
    const pendingPercent = document.querySelector('.pending-percent');
    const deletedPercent = document.querySelector('.deleted-percent');

    const completedSlider = document.querySelector('.completed-slider');
    const deletedSlider = document.querySelector('.deleted-slider');
    const pendingSlider = document.querySelector('.pending-slider');

    const completedBar = document.querySelector('.completed-bar');
    const deletedBar = document.querySelector('.deleted-bar');
    const pendingBar = document.querySelector('.pending-bar');

    const totalCount = document.querySelector('.total-count');

    const data = await getStatistics()

    completedCount.innerText = data['completed-count'];
    pendingCount.innerText = data['pending-count'];
    deletedCount.innerText = data['deleted-count'];

    completedPercent.innerText = data['completed-percent'];
    pendingPercent.innerText = data['pending-percent'];
    deletedPercent.innerText = data['deleted-percent'];

    completedSlider.style.width = `${data['completed-percent']}%`;
    pendingSlider.style.width = `${data['pending-percent']}%`;
    deletedSlider.style.width = `${data['deleted-percent']}%`;
    
    completedBar.style.height = `${data['completed-percent']}%`;
    pendingBar.style.height = `${data['pending-percent']}%`;
    deletedBar.style.height = `${data['deleted-percent']}%`;

    totalCount.innerText = data['completed-count']  + data['pending-count'] + data['deleted-count'];
}

const darkMode = localStorage.getItem('dark-mode');

const body = document.querySelector('body');
const mainHeading = document.querySelector('.main-heading');
const totalTasks = document.querySelector('.total-tasks');
const copyRightText = document.querySelector('.copy-right-text');

if (darkMode === 'true'){
    body.style.backgroundColor = 'black';
    mainHeading.style.color = 'white';
    totalTasks.style.color = 'white';
    copyRightText.style.color = 'white';
} else {
    body.style.backgroundColor = 'rgb(167, 236, 236)';
    mainHeading.style.color = 'black';
    totalTasks.style.color = 'black';
    copyRightText.style.color = 'black';
}


loadDashboard()