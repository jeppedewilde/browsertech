// ==================
// --- js/main.js ---
// ==================

import { setupLiveValidation, setupSubmitValidation } from './validation.js';
import { setupConditionalRequirements } from './conditions.js';
import { initializeStepper } from './stepper.js';

document.body.classList.remove('no-js');

const form = document.querySelector('form');

    if (form) {
        form.setAttribute('novalidate', 'true');
    }

document.addEventListener("DOMContentLoaded", () => {
    
    // required attributen
    setupConditionalRequirements();
    
    // validatie
    setupLiveValidation();
    
    // start stepper
    initializeStepper();

    // validatie submit button
    setupSubmitValidation();

    const chapterTitles = document.querySelectorAll('.chapter-title');

    chapterTitles.forEach(title => {
        title.addEventListener('click', () => {
            // zoek <section> waar titel in zit
            const chapter = title.closest('.form-chapter');
        
                // klap  in/uit als het hoofdstuk is afgerond
                if (chapter.classList.contains('is-finished')) {
                    const content = chapter.querySelector('.chapter-content');
                    content.classList.toggle('is-hidden');
        }
    });
});
});