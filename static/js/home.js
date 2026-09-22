
console.log(window.location)
async function getTasks(status) {

  try {
   const response = await fetch(`/get_tasks/${status}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return await response.json();
    

  } catch (error) {
    console.error(error);
  }
}

const hamburgerButton = document.querySelector('.hamburger-btn');
const menuContainer = document.querySelector('.menu-container');

let pendingButtonActive = true;
let deletedButtonActive = false;
let completedButtonActive = false;

function setUpNavbar() {

    const pendingButtons = document.querySelectorAll(".pending-btn");
    const completedButtons = document.querySelectorAll(".completed-btn");
    const deletedButtons = document.querySelectorAll(".deleted-btn");
    const accountButtons = document.querySelectorAll(".account-logo")

    
    if (pendingButtonActive){
        pendingButtons.forEach(pendingButton=>{pendingButton.classList.add("active")});
    } else if (deletedButtonActive){
        deletedButtons.forEach(deletedButton => {deletedButton.classList.add("active");})
    } else {
        completedButtons.forEach(completedButton => {completedButton.classList.add("active")})
    }
   
    pendingButtons.forEach(pendingButton=>{
        pendingButton.addEventListener("click", async (evt)=>{
        evt.preventDefault()
        pendingButton.classList.add("active");
        deletedButtons.forEach(deletedButton => {deletedButton.classList.remove("active");})
        completedButtons.forEach(completedButton => {completedButton.classList.remove("active")})
        
        showTasks("PENDING");
        pendingButtonActive = true;
        deletedButtonActive = false;
        completedButtonActive = false;

    });
    })

    
    deletedButtons.forEach(deletedButton=>{
        deletedButton.addEventListener("click", async (evt)=>{
        evt.preventDefault()
        deletedButton.classList.add("active");
        pendingButtons.forEach(pendingButton=>{pendingButton.classList.remove("active")});
        completedButtons.forEach(completedButton=>{completedButton.classList.remove("active")});
        showTasks("DELETED");
        pendingButtonActive = false;
        deletedButtonActive = true;
        completedButtonActive = false;
    });
    })

    completedButtons.forEach(completedButton=>{
        completedButton.addEventListener("click", async (evt)=>{
        evt.preventDefault()
        completedButton.classList.add("active");
        pendingButtons.forEach(pendingButton=>{pendingButton.classList.remove("active")});
        deletedButtons.forEach(deletedButton=>{deletedButton.classList.remove("active")});
        showTasks("COMPLETED");
        pendingButtonActive = false;
        deletedButtonActive = false;
        completedButtonActive = true;
    });
    })
    accountButtons.forEach(accountButton => {
        accountButton.addEventListener('click', ()=>{
            window.location.href = '/account'
        })
        
    })
    

    let menuContainerVisible = false;
    hamburgerButton.addEventListener('click', ()=>{
        if (!menuContainerVisible){
            menuContainer.style.display = 'flex';
            hamburgerButton.setAttribute('src', '../static/images/cross-logo.png')
            menuContainerVisible = true;
        } else {
            menuContainer.style.display = 'none';
            hamburgerButton.setAttribute('src', '../static/images/hamburger-logo.png')
            menuContainerVisible = false;
        }
    })
}

function closeMenu() {

    if (window.innerWidth > 1400){
        menuContainer.style.display = 'none';
        hamburgerButton.setAttribute('src', '../static/images/hamburger-logo.png')
    }
    setUpNavbar();
}
window.addEventListener('resize', closeMenu)



async function deleteTask(taskId) {

    const response = await fetch(`/delete-task/${taskId}`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
    showTasks("PENDING");
}

async function completeTask(taskId) {
    const response = await fetch(`/mark-task-completed/${taskId}`,{
        method: "POST"
    });
    if (!response.ok){
        throw new Error("Failed to mark as completed");
    }
    showTasks("PENDING");
}

function createCompletedButton(taskId, container) {

    const completeButton = document.createElement('button');
    completeButton.classList.add("complete-btn")

    const completeImg =document.createElement('img');
    completeImg.classList.add("complete-img");
    completeImg.setAttribute("src", "/static/images/completed-tick.png")

    completeButton.appendChild(completeImg);
    container.appendChild(completeButton);

    completeButton.addEventListener("click", ()=>{
        completeTask(taskId);
    })
}

function createEditbutton(taskId, container) {

    const editButton = document.createElement('button');
    editButton.classList.add("edit-btn")

    const editImg =document.createElement('img');
    editImg.classList.add("edit-img");
    editImg.setAttribute("src", "/static/images/edit-pencil.png")

    editButton.appendChild(editImg);
    container.appendChild(editButton);

    editButton.addEventListener("click", ()=>{
        window.location.href = `/edit-task/${taskId}`;
    })


}

function createDeleteButton(taskId, container) {

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-btn")

    const deleteImg =document.createElement('img');
    deleteImg.classList.add("delete-img");
    deleteImg.setAttribute("src", "/static/images/delete-bin.png")

    deleteButton.appendChild(deleteImg);
    container.appendChild(deleteButton);

    deleteButton.addEventListener("click", ()=>{
        deleteTask(taskId);
    })
}
function generateRandomImage() {
    const images = [
        'todo-template-01.png',
        'todo-template-02.png',
        'todo-template-03.png',
        'todo-template-04.png',
        'todo-template-05.png',
        'todo-template-06.png',
        'todo-template-07.png',
        'todo-template-08.png',
        'todo-template-09.png',
        'todo-template-10.png'

    ]
    const randomNumber = Math.floor(Math.random()*10)
    return images[randomNumber]
}
let tasks;
async function showTasks(status='PENDING', titleStartsWith=''){
    tasks = await getTasks(status)
    
    const taskContainer = document.querySelector(".task-container");
    taskContainer.innerHTML = '';
 

    for( let task of tasks){
        if (! task.title.startsWith(titleStartsWith)){
            continue
        }
        const taskButtons = document.createElement('div');
        taskButtons.classList.add('task-buttons', 'fr', 'fe');

        if (status === 'PENDING'){

        createCompletedButton(task.task_id, taskButtons);
        createEditbutton(task.task_id, taskButtons);
        createDeleteButton(task.task_id, taskButtons);
        }
        
        const taskBox = document.createElement('div');
        taskBox.classList.add("task-box");
        taskBox.classList.add("fc");

        const priority = document.createElement('p');
        priority.classList.add('priority');
        priority.innerText = task.priority;
        taskBox.appendChild(priority);

        const title = document.createElement('p');
        title.classList.add("title");
        title.innerText = task.title;
        taskBox.appendChild(title);


        const description = document.createElement('p');
        description.classList.add("description");
        description.innerText = task.description;
        taskBox.appendChild(description);


        const dueDate = document.createElement('p');
        dueDate.classList.add('due-date');
        dueDate.innerText = task.due_date
        taskBox.appendChild(dueDate);

        taskBox.style.backgroundImage = `url('../static/images/${generateRandomImage()}')`;

        taskBox.appendChild(taskButtons);
        taskContainer.appendChild(taskBox);
    }
}
function blinkHighPriority() {
    const priorities = document.querySelectorAll(".priority");
    for (let priority of priorities){
        
        if (priority.innerText === "HIGH"){
            priority.style.color = 'red';
            priority.style.fontWeight = 'bold';
            
            let hidden = false;
            setInterval(()=>{
                if (hidden){
                    priority.style.visibility = 'visible';
                    hidden = false;
                } else {
                    priority.style.visibility = 'hidden';
                    hidden = true;
                }
            }, 1000)
        }
        
    }
}
function loadCommunity() {
    const communityButtons = document.querySelectorAll(".community-btn");
    for (const communityButton of communityButtons){
        communityButton.addEventListener("click", (evt)=>{
        evt.preventDefault();
        window.location.href = "/community"

    })
    }
    
}
async function setUpDashboard(){
    const dashboardButtons = document.querySelectorAll(".dashboard-btn");

    for (const dashboardButton of dashboardButtons){
        dashboardButton.addEventListener('click', (evt)=>{
        evt.preventDefault()
        window.location.href = "/dashboard"
    })
    }
    

   
}

function loadSuggestions(text){
    const suggestionContainer = document.querySelector('.suggestion-container');
    const searchBar = document.querySelector('.search-bar');
    suggestionContainer.innerHTML = '';
    
    for (const task of tasks){

        if (task.title.toLowerCase().startsWith(text.toLowerCase())){
            let suggestion = document.createElement('p');
            suggestion.classList.add('suggestion');

            suggestion.innerText = task.title;

            suggestion.addEventListener('click', ()=>{
                searchBar.value = task.title;
                showTasks(task.status, task.title);
                searchCrossButton.style.display = 'block';
            })

            suggestionContainer.appendChild(suggestion);
        }
        
    }
    
  

}

const searchCrossButton = document.querySelector('.search-cross-btn');
function setUpSearchBar(){
    const searchBar = document.querySelector('.search-bar');
    const suggestionContainer = document.querySelector('.suggestion-container');
    loadSuggestions('');

    searchBar.addEventListener('input', ()=>{
        loadSuggestions(searchBar.value)
    });
    searchBar.addEventListener('focus', ()=>{
        suggestionContainer.style.display = 'block';
        loadSuggestions('')
    });

    searchBar.addEventListener('blur', ()=>{
        setTimeout(()=>{
            suggestionContainer.style.display = 'none';
        }, 200)
        
    })
    searchCrossButton.addEventListener('click', ()=>{
        searchBar.value = '';
        searchCrossButton.style.display = 'none';
        showTasks(tasks[0].status)
    })
}



function setMode(){
    const navBar = document.querySelector(".nav-bar");
    const mainNavButtons = document.querySelectorAll(".main-nav-buttons a");
    const copyRightText = document.querySelector(".copy-right-text");
    const modeLogo = document.querySelector('.mode-logo');
    const settingsLogo = document.querySelector('.settings-logo');
    const userLogo = document.querySelector('.account-logo');


    if (localStorage.getItem('dark-mode') === 'true'){
        document.body.style.backgroundColor = 'black';
        navBar.style.color = 'white';
        mainNavButtons.forEach(mainNavBtn=>mainNavBtn.style.color = 'white');
        copyRightText.style.color = 'white';
        modeLogo.setAttribute('src', 'static/images/mode-logo-white.png');
        settingsLogo.setAttribute('src', 'static/images/settings-logo-white.png');
        userLogo.setAttribute('src', 'static/images/user-logo-white.png');
        darkMode = true;
        localStorage.setItem('dark-mode', 'true')
    } else {
        document.body.style.backgroundColor = 'white';
        navBar.style.color = 'black';
        mainNavButtons.forEach(mainNavBtn=>mainNavBtn.style.color = 'black');
        copyRightText.style.color = 'black'
        modeLogo.setAttribute('src', 'static/images/mode-logo.png');
        settingsLogo.setAttribute('src', 'static/images/settings-logo.png');
        userLogo.setAttribute('src', 'static/images/user-logo.png');
        darkMode = false;
        localStorage.setItem('dark-mode', 'false')
    }
}

let darkMode = false;
function activateDarkModeButton(){
    const darkModeButton = document.querySelector(".mode-logo")
    darkModeButton.addEventListener('click', ()=>{
        if (darkMode){
            darkMode = false;
        } else {
            darkMode = true
        }
        localStorage.setItem('dark-mode', `${darkMode}`)
        setMode()
    })
    setMode()
}

async function run() {
    await showTasks();
    setUpNavbar();
    blinkHighPriority();
    loadCommunity();
    setUpDashboard();
    setUpSearchBar();
    activateDarkModeButton();
}
run()