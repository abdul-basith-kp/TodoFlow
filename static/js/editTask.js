


const darkMode = localStorage.getItem('dark-mode');

const body = document.querySelector('body');
const editTaskContainer = document.querySelector('.edit-task-container');
const mainParagraph = document.querySelector('.main-paragraph')
const labels = document.querySelectorAll('label');

if (darkMode === 'true'){
    body.style.backgroundColor = 'black';
    editTaskContainer.style.borderColor = 'white';
    mainParagraph.style.color = 'white';
    labels.forEach(label=>label.style.color = 'white')
} else {
    body.style.backgroundColor = 'white';
    editTaskContainer.style.borderColor = 'black';
    mainParagraph.style.color = 'black';
    labels.forEach(label=>label.style.color = 'black')

}