

const darkMode = localStorage.getItem('dark-mode');

const body = document.querySelector('body');
const mainParagraph = document.querySelector('.main-paragraph');
const addtaskForm = document.querySelector('.add-task-form');
const labels = document.querySelector('label')
if (darkMode === 'true'){
    body.style.backgroundColor = 'black';
    mainParagraph.style.color = 'white';
    addtaskForm.style.borderColor = 'white';
    labels.forEach(label=>label.style.color = 'white');
} else {

}