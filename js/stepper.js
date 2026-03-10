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

    const goToStep = (newIndex) => {
        steps[currentStepIndex].classList.add('is-hidden'); 
        currentStepIndex = newIndex; 
        steps[currentStepIndex].classList.remove('is-hidden'); 
        
        updateChapterVisibility();
        setFocus(steps[currentStepIndex].querySelector('legend'));
    };

const finishStepper = () => {
        const stepperChapter = steps[0].closest('.form-chapter'); 
        const allChapters = document.querySelectorAll('.form-chapter');
        
        stepperChapter.classList.add('is-finished');
        
        const content = stepperChapter.querySelector('.chapter-content');
        if (content) {
            content.classList.add('is-hidden');
        }
        
        stepperChapter.classList.remove('is-hidden');

        allChapters.forEach(chapter => {
            if (chapter !== stepperChapter) {
                chapter.classList.remove('is-hidden');
            }
        });

        if (allChapters.length > 1 && allChapters[1]) {
            setFocus(allChapters[1].querySelector('h2'));
        }
    };

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