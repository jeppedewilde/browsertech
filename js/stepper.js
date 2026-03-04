// =======================================================================================
// ------------------------------------ js/stepper.js ------------------------------------
// initStepper, createNavigationButtons, goToStep, finishStepper, updateChapterVisibility.
// =======================================================================================

import { validateCurrentStep } from './validation.js';
import { determineNextStep } from './conditions.js';

export function initializeStepper() {
    const steps = document.querySelectorAll('form .step');
    let currentStepIndex = 0;
    let stepHistory = []; 

    if (steps.length === 0) return;

    function initStepper() {
        steps.forEach((step, index) => {
            if (index !== currentStepIndex) {
                step.classList.add('is-hidden');
            } else {
                step.classList.remove('is-hidden');
            }
            createNavigationButtons(step, index);
        });
        updateChapterVisibility();
    }

    function createNavigationButtons(stepElement, index) {
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('step-navigation');

        if (index > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.textContent = 'Vorige';
            prevBtn.addEventListener('click', () => {
                const previousIndex = stepHistory.pop(); 
                goToStep(previousIndex);
            });
            btnContainer.appendChild(prevBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.textContent = 'Volgende';
        nextBtn.addEventListener('click', () => {
            
            if (validateCurrentStep(steps[currentStepIndex])) {
                // LET OP: we sturen steps.length nu mee
                let nextIndex = determineNextStep(currentStepIndex, steps.length);
                
                if (nextIndex >= steps.length) {
                    finishStepper();
                } else {
                    stepHistory.push(currentStepIndex);
                    goToStep(nextIndex);
                }
            }
        });
        btnContainer.appendChild(nextBtn);

        stepElement.appendChild(btnContainer);
    }

    function goToStep(newIndex) {
        steps[currentStepIndex].classList.add('is-hidden');
        currentStepIndex = newIndex;
        steps[currentStepIndex].classList.remove('is-hidden');
        
        updateChapterVisibility();

        const currentLegend = steps[currentStepIndex].querySelector('legend');
        if (currentLegend) {
            currentLegend.setAttribute('tabindex', '-1');
            currentLegend.focus();
        }
    }

    function finishStepper() {
        const chapter1 = steps[0].closest('.form-chapter');
        if (chapter1) chapter1.classList.add('is-hidden');

        const allChapters = document.querySelectorAll('.form-chapter');
        allChapters.forEach((chapter, index) => {
            if (index > 0) chapter.classList.remove('is-hidden');
        });

        if (allChapters[1]) {
            const chapter2Title = allChapters[1].querySelector('h2');
            if (chapter2Title) {
                chapter2Title.setAttribute('tabindex', '-1');
                chapter2Title.focus();
            }
        }
    }

    function updateChapterVisibility() {
        document.querySelectorAll('.form-chapter').forEach(chapter => {
            chapter.classList.add('is-hidden');
        });
        
        const currentStep = steps[currentStepIndex];
        const currentChapter = currentStep.closest('.form-chapter');
        if (currentChapter) {
            currentChapter.classList.remove('is-hidden');
        }
    }

    initStepper();
}