// ============================================================================
// ----------------------------- js/stepper.js ------------------------------
// ============================================================================

import { validateCurrentStep } from './validation.js';
import { determineNextStep } from './conditions.js';

export function initializeStepper() {
    const steps = document.querySelectorAll('form .step');
    if (!steps.length) return; 

    let currentStepIndex = 0;
    let stepHistory = []; 

    // ------------------------------------------------------------------------
    // --- HULPFUNCTIES ---
    // ------------------------------------------------------------------------

    const createButton = (text, onClick) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    };

    const setFocus = (element) => {
        if (element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
        }
    };

    const updateChapterVisibility = () => {
        const currentChapter = steps[currentStepIndex].closest('.form-chapter');
        document.querySelectorAll('.form-chapter').forEach(chapter => {
            chapter.classList.toggle('is-hidden', chapter !== currentChapter);
        });
    };

    // ------------------------------------------------------------------------
    // --- NAVIGATIE LOGICA ---
    // ------------------------------------------------------------------------

    const goToStep = (newIndex) => {
        steps[currentStepIndex].classList.add('is-hidden'); 
        currentStepIndex = newIndex; 
        steps[currentStepIndex].classList.remove('is-hidden'); 
        
        updateChapterVisibility();
        setFocus(steps[currentStepIndex].querySelector('legend'));
    };

const finishStepper = () => {
        const stepperChapter = steps[0].closest('.form-chapter'); // Dit is Hoofdstuk 1
        const allChapters = document.querySelectorAll('.form-chapter');
        
        // 1. Geef Hoofdstuk 1 de 'is-finished' status (jouw CSS doet nu de rest voor de stappen!)
        stepperChapter.classList.add('is-finished');
        
        // 2. Verberg niet het HELE hoofdstuk, maar alleen het 'doosje' met de vragen erin
        const content = stepperChapter.querySelector('.chapter-content');
        if (content) {
            content.classList.add('is-hidden');
        }
        
        // 3. Zorg dat de sectie zelf zichtbaar blijft (zodat we de <h2> nog zien)
        stepperChapter.classList.remove('is-hidden');

        // 4. Laat alle overige hoofdstukken (Hoofdstuk 2) netjes in beeld verschijnen
        allChapters.forEach(chapter => {
            if (chapter !== stepperChapter) {
                chapter.classList.remove('is-hidden');
            }
        });

        // 5. Zet de focus netjes op de titel van Hoofdstuk 2 voor schermlezers
        if (allChapters.length > 1 && allChapters[1]) {
            setFocus(allChapters[1].querySelector('h2'));
        }
    };

    // ------------------------------------------------------------------------
    // --- INITIALISATIE ---
    // ------------------------------------------------------------------------

    steps.forEach((step, index) => {
        step.classList.toggle('is-hidden', index !== currentStepIndex);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'step-navigation';

        if (index > 0) {
            btnContainer.appendChild(createButton('Vorige', () => goToStep(stepHistory.pop())));
        }

        btnContainer.appendChild(createButton('Volgende', () => {
            if (validateCurrentStep(steps[currentStepIndex])) {
                const nextIndex = determineNextStep(currentStepIndex, steps.length);
                
                if (nextIndex >= steps.length) {
                    finishStepper();
                } else {
                    stepHistory.push(currentStepIndex);
                    goToStep(nextIndex);
                }
            }
        }));

        step.appendChild(btnContainer);
    });

    updateChapterVisibility(); 
}