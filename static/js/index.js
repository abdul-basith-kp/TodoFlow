
const words = [
        'Completed',
        'Finished',
        'Concluded',
        'Accomplished',
        'Fulfilled',
        'Finalized',
        'Achieved',
        'Executed',
        'Done'];

const heroMainSpan = document.querySelector(".hero-main-span");

let index = 0;

setInterval(() => {
    heroMainSpan.innerText = words[index];

    index = (index + 1) % words.length;
}, 1000);