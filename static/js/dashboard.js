


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

loadDashboard()