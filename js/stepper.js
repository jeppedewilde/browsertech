// ============================================================================
// ----------------------------- js/stepper.js ------------------------------
// ============================================================================

import { validateCurrentStep } from './validation.js';
import { determineNextStep } from './conditions.js';

// stepper function
export function initializeStepper() {
    const steps = document.querySelectorAll('form .step');
    if (!steps.length) return; 

    let currentStepIndex = 0;
    let stepHistory = []; 

    // buttons aanmaken
    const createButton = (text, onClick) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    };

    // focus naar legend nieuwe vraag
    const setFocus = (element) => {
        if (element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
        }
    };

    // update progress bar
    const progressBar = document.getElementById('form-progress');

    const updateProgress = () => {
        if (!progressBar) return;
        const percentage = (currentStepIndex / (steps.length - 1)) * 100;
        progressBar.value = percentage;
    };

    // alleen huidige hoofdstuk is te zien
    const updateChapterVisibility = () => {
        const currentChapter = steps[currentStepIndex].closest('.form-chapter');
        document.querySelectorAll('.form-chapter').forEach(chapter => {
            chapter.classList.toggle('is-hidden', chapter !== currentChapter);
        });
    };

    // verbergd vorige stap en roept nieuwe stap aan
    const goToStep = (newIndex) => {
        steps[currentStepIndex].classList.add('is-hidden'); 
        currentStepIndex = newIndex; 
        steps[currentStepIndex].classList.remove('is-hidden'); 

        updateProgress();
        
        updateChapterVisibility();
        setFocus(steps[currentStepIndex].querySelector('legend'));
    };

// verbergd hoofdstuk bij afronden en voegt css class voor overzichtsweergave toe
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

    // werken van de stepper
    steps.forEach((step, index) => {
        // niet de huidige stap? hidden.
        step.classList.toggle('is-hidden', index !== currentStepIndex);

        // maakt step navigation div
        const btnContainer = document.createElement('div');
        btnContainer.className = 'step-navigation';

        // zorgt dat bij klikken op vorige echt de vorige beantwoordde vraag showen
        if (index > 0) {
            btnContainer.appendChild(createButton('Vorige', () => goToStep(stepHistory.pop())));
        }

        // bij klikken op volgende
        btnContainer.appendChild(createButton('Volgende', () => {
            // geen rode velden?
            if (validateCurrentStep(steps[currentStepIndex])) {
                // wat is het volgende veld?
                const nextIndex = determineNextStep(currentStepIndex, steps.length);
                
                // al klaar of doorgaan?
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