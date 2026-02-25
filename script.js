/// Show questions one by one ///
document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll('form .step');
    let currentStepIndex = 0;
    
    // We houden de route bij in een array
    let stepHistory = []; 

    if (steps.length === 0) return;

    function initStepper() {
        steps.forEach((step, index) => {
            if (index !== currentStepIndex) {
                step.style.display = 'none';
            } else {
                step.style.display = 'block';
            }
            createNavigationButtons(step, index);
        });

        // NIEUW: Zorg dat bij de start alleen het eerste hoofdstuk zichtbaar is
        updateChapterVisibility();
    }

    function createNavigationButtons(stepElement, index) {
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('step-navigation');

        // VORIGE KNOP
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

        // VOLGENDE KNOP
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.textContent = 'Volgende';
        nextBtn.addEventListener('click', () => {
            
            // NIEUW: Valideer de huidige stap eerst!
            if (validateCurrentStep()) {
                let nextIndex = determineNextStep(currentStepIndex);
                
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

    // De slimme routing functie
    function determineNextStep(currentIndex) {
        let nextIndex = currentIndex + 1; // Standaard 1 stap vooruit

        // 1. Check voor Getrouwd? (index 1)
        if (currentIndex === 1) {
            const relationshipAnswer = document.querySelector('input[name="relationship"]:checked');
            if (relationshipAnswer && relationshipAnswer.value === 'not-married') {
                nextIndex = 5; // Ga naar: Kinderen?
            }
        }

        // 2. Check voor Kinderen? (index 5)
        if (currentIndex === 5) {
            const childrenAnswer = document.querySelector('input[name="children"]:checked');
            if (childrenAnswer && childrenAnswer.value === 'no-children') {
                nextIndex = 8; // Ga naar: Testament?
            }
        }

        // 3. Check voor Testament? (index 8)
        if (currentIndex === 8) {
            const testamentAnswer = document.querySelector('input[name="testament"]:checked');
            if (testamentAnswer && testamentAnswer.value === 'no-testament') {
                // Sla de notaris over en sluit de stepper af
                nextIndex = steps.length; 
            }
        }

        return nextIndex;
    }

    function goToStep(newIndex) {
        steps[currentStepIndex].style.display = 'none';
        currentStepIndex = newIndex;
        steps[currentStepIndex].style.display = 'block';
        
        // NIEUW: Update welk hoofdstuk zichtbaar is
        updateChapterVisibility();

        const currentLegend = steps[currentStepIndex].querySelector('legend');
        if (currentLegend) {
            currentLegend.setAttribute('tabindex', '-1');
            currentLegend.focus();
        }
    }

    // NIEUW: Functie om de stepper af te sluiten en de rest van het formulier te tonen
    function finishStepper() {
        // 1. Verberg hoofdstuk 1 (de stepper)
        const chapter1 = steps[0].closest('.form-chapter');
        if (chapter1) {
            chapter1.style.display = 'none';
        }

        // 2. Toon alle andere hoofdstukken (hoofdstuk 2 en 3)
        const allChapters = document.querySelectorAll('.form-chapter');
        allChapters.forEach((chapter, index) => {
            if (index > 0) { // index 0 is hoofdstuk 1, die slaan we over
                chapter.style.display = 'block';
            }
        });

        // 3. Toegankelijkheid: verplaats de focus naar de titel van Hoofdstuk 2
        // Zodat de screenreader direct begint met voorlezen van het nieuwe deel
        if (allChapters[1]) {
            const chapter2Title = allChapters[1].querySelector('h2');
            if (chapter2Title) {
                chapter2Title.setAttribute('tabindex', '-1');
                chapter2Title.focus();
            }
        }
    }

    // NIEUW: Functie om de juiste h2 / sectie te tonen
    function updateChapterVisibility() {
        // 1. Verberg eerst alle hoofdstukken
        document.querySelectorAll('.form-chapter').forEach(chapter => {
            chapter.style.display = 'none';
        });
        
        // 2. Zoek het hoofdstuk waar de actuele stap in zit, en toon die
        const currentStep = steps[currentStepIndex];
        const currentChapter = currentStep.closest('.form-chapter');
        if (currentChapter) {
            currentChapter.style.display = 'block';
        }
    }

    initStepper();
});