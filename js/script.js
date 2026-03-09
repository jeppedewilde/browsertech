/// Show questions one by one ///
document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll('form .step');
    let currentStepIndex = 0;

    // Array
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


        // Alleen eerste hoofdstuk zichtbaar bij start
        updateChapterVisibility();
    }


    function createNavigationButtons(stepElement, index) {
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('step-navigation');


        // Vorige knop
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


        // Volgende knop
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.textContent = 'Volgende';
        nextBtn.addEventListener('click', () => {

            // Valideer huidige stap
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


    // Slimme route
    function determineNextStep(currentIndex) {
        let nextIndex = currentIndex + 1; // Standaard 1 stap vooruit


        // 1. Check voor Getrouwd? (index 1)
        if (currentIndex === 1) {
            const relationshipAnswer = document.querySelector('input[name="relationship"]:checked');
            if (relationshipAnswer && relationshipAnswer.value === 'not-married') {
                nextIndex = 5; // Ga naar: Kinderen? (index 5)
            }
        }


        // 2. Check voor Kinderen? (index 5)
        if (currentIndex === 5) {
            const childrenAnswer = document.querySelector('input[name="children"]:checked');
            if (childrenAnswer && childrenAnswer.value === 'no-children') {
                nextIndex = 8; // Ga naar: Testament? (index 8)
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
        // Verberg de oude stap door de class toe te voegen
        steps[currentStepIndex].classList.add('is-hidden');

        currentStepIndex = newIndex;

        // Toon de nieuwe stap door de class weg te halen
        steps[currentStepIndex].classList.remove('is-hidden');

        updateChapterVisibility();


        const currentLegend = steps[currentStepIndex].querySelector('legend');
        if (currentLegend) {
            currentLegend.setAttribute('tabindex', '-1');
            currentLegend.focus();
        }
    }


    // Functie om de stepper af te sluiten en de rest van het formulier te tonen
    function finishStepper() {
        // 1. Verberg hoofdstuk 1 (de stepper)
        const chapter1 = steps[0].closest('.form-chapter');
        if (chapter1) {
            chapter1.style.display = 'none';
        }


        // 2. Toon alle andere hoofdstukken (hoofdstuk 2 en 3)
        const allChapters = document.querySelectorAll('.form-chapter');
        allChapters.forEach((chapter, index) => {
            if (index > 0) { // index 0 is hoofdstuk 1
                chapter.style.display = 'block';
            }
        });


        // Verplaats de focus naar de titel van Hoofdstuk 2 (toegankelijkheid)
        if (allChapters[1]) {
            const chapter2Title = allChapters[1].querySelector('h2');
            if (chapter2Title) {
                chapter2Title.setAttribute('tabindex', '-1');
                chapter2Title.focus();
            }
        }
    }


    // Functie om de juiste h2 / sectie te tonen
    function updateChapterVisibility() {
        // 1. Verberg eerst alle hoofdstukken
        document.querySelectorAll('.form-chapter').forEach(chapter => {
            chapter.style.display = 'none';
        });

        // 2. Zoek het hoofdstuk waar de huidige stap in zit, en toon die
        const currentStep = steps[currentStepIndex];
        const currentChapter = currentStep.closest('.form-chapter');
        if (currentChapter) {
            currentChapter.style.display = 'block';
        }
    }


    // ==========================================
    // --- CONDITIONELE REQUIRED FUNCTIES ---
    // ==========================================


    function setupConditionalRequirements() {
        // 1. Zoek de radiobuttons die de triggers zijn
        const relationshipRadios = document.querySelectorAll('input[name="relationship"]');
        const childrenRadios = document.querySelectorAll('input[name="children"]');
        // NIEUW: Zoek de testament radiobuttons
        const testamentRadios = document.querySelectorAll('input[name="testament"]');


        // 2. Functie voor de Huwelijk-route
        function updateRelationshipRequirements() {
            const isMarriedInput = document.querySelector('input[name="relationship"][value="married"]');
            const isMarried = isMarriedInput ? isMarriedInput.checked : false;

            const conditionsRadios = document.querySelectorAll('input[name="conditions"]');
            const settlementRadios = document.querySelectorAll('input[name="final-settlement"]');
            const dateConditions = document.getElementById('date-conditions');


            const fieldsToUpdate = [...conditionsRadios, ...settlementRadios];
            if (dateConditions) fieldsToUpdate.push(dateConditions);


            fieldsToUpdate.forEach(el => {
                if (isMarried) {
                    el.setAttribute('required', 'required');
                } else {
                    el.removeAttribute('required');
                    clearMessages(el);
                    el.classList.remove('is-validated');
                }
            });
        }


        // 3. Functie voor de Kinderen-route
        function updateChildrenRequirements() {
            const hasChildrenInput = document.querySelector('input[name="children"][value="children"]');
            const hasChildren = hasChildrenInput ? hasChildrenInput.checked : false;

            const childDeceasedRadios = document.querySelectorAll('input[name="child-deceased"]');
            const childHasChildrenRadios = document.querySelectorAll('input[name="child-has-children"]');


            const fieldsToUpdate = [...childDeceasedRadios, ...childHasChildrenRadios];


            fieldsToUpdate.forEach(el => {
                if (hasChildren) {
                    el.setAttribute('required', 'required');
                } else {
                    el.removeAttribute('required');
                    clearMessages(el);
                }
            });
        }


        // 4. NIEUW: Functie voor de Testament-route
        function updateTestamentRequirements() {
            const hasTestamentInput = document.querySelector('input[name="testament"][value="testament"]');
            const hasTestament = hasTestamentInput ? hasTestamentInput.checked : false;

            // Verzamel alle notarisvelden, BEHALVE het tussenvoegsel (infix)
            const notaryFields = [
                document.getElementById('protocol-number'),
                document.getElementById('initials-notary'),
                document.getElementById('lname-notary'),
                document.getElementById('location'),
                document.getElementById('day-changes'),
                document.getElementById('month-changes'),
                document.getElementById('year-changes')
            ];


            notaryFields.forEach(el => {
                if (el) { // Extra veiligheidscheck of het veld bestaat
                    if (hasTestament) {
                        el.setAttribute('required', 'required');
                    } else {
                        el.removeAttribute('required');
                        clearMessages(el);
                        el.classList.remove('is-validated');
                    }
                }
            });
        }


        // 5. Koppel de functies aan het 'change' event van de radiobuttons
        relationshipRadios.forEach(radio => radio.addEventListener('change', updateRelationshipRequirements));
        childrenRadios.forEach(radio => radio.addEventListener('change', updateChildrenRequirements));
        // NIEUW: Koppel de testament radiobuttons
        testamentRadios.forEach(radio => radio.addEventListener('change', updateTestamentRequirements));


        // 6. Draai ze direct één keer bij het inladen
        updateRelationshipRequirements();
        updateChildrenRequirements();
        // NIEUW: Start check voor testament
        updateTestamentRequirements();
    }


    // ==========================================
    // --- VALIDATIE FUNCTIES ---
    // ==========================================


    function setupLiveValidation() {
        const textInputs = document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="button"]):not([type="submit"])');

        textInputs.forEach(input => {
            input.addEventListener('blur', () => {
                // false = alleen visuele feedback (kleuren)
                validateSingleInput(input, false);
            });
        });
    }


    // functie voor showText
    function validateSingleInput(input, showText = false) {
        clearMessages(input);
        let isValid = true;


        // Vertel de CSS dat dit veld is aangeraakt/gecontroleerd
        input.classList.add('is-validated');


        if (!input.checkValidity()) {
            isValid = false;

            // Toon de tekst alléén als showText true is (bij klikken op Volgende)
            if (showText) {
                let errorMsg = input.validationMessage;

                if (input.validity.patternMismatch) {
                    if (input.pattern === '[0-9]{9}') {
                        errorMsg = "Dit veld moet precies 9 cijfers bevatten.";
                    } else if (input.pattern === '[0-9]{4}') {
                        errorMsg = "Vul een geldig jaartal in (bijv. 2026).";
                    } else if (input.pattern === '[0-9]{1,2}') {
                        errorMsg = "Vul 1 of 2 cijfers in.";
                    }
                }

                showMessage(input, errorMsg, 'error-msg');
            }
        } else if (input.value.trim() === '' && !input.required) {
            // Als een veld optioneel is en de gebruiker laat het leeg,
            // halen we het stempel weg (zodat het niet onnodig groen wordt)
            input.classList.remove('is-validated');
        }


        return isValid;
    }


    function validateCurrentStep() {
        const currentStepEl = steps[currentStepIndex];
        const inputs = currentStepEl.querySelectorAll('input');
        let isStepValid = true;
        let checkedRadios = [];


        inputs.forEach(input => {
            if (input.type === 'button' || input.type === 'submit') return;


            if (input.type === 'radio') {
                if (checkedRadios.includes(input.name)) return;
                checkedRadios.push(input.name);


                clearMessages(input);


                if (!input.checkValidity()) {
                    isStepValid = false;
                    showMessage(input, "Kies alstublieft één van de opties.", 'error-msg');
                }
            } else {
                // true = toon tekst omdat de gebruiker op volgende klikte terwijl het fout was
                const fieldIsValid = validateSingleInput(input, true);
                if (!fieldIsValid) {
                    isStepValid = false;
                }
            }
        });


        return isStepValid;
    }


    function showMessage(input, text, className) {
        const msg = document.createElement('span');
        msg.className = `feedback-msg ${className}`;
        msg.textContent = text;

        const msgId = 'msg-' + Math.random().toString(36).substr(2, 9);
        msg.id = msgId;


        if (input.type === 'radio') {
            const fieldset = input.closest('fieldset');
            if (fieldset) {
                fieldset.appendChild(msg);
                const group = fieldset.querySelectorAll(`input[name="${input.name}"]`);
                group.forEach(radio => radio.setAttribute('aria-describedby', msgId));
            }
        } else {
            input.parentNode.insertBefore(msg, input.nextSibling);
            input.setAttribute('aria-describedby', msgId);
        }
    }


    function clearMessages(input) {
        const msgId = input.getAttribute('aria-describedby');

        if (msgId) {
            const msgElement = document.getElementById(msgId);
            if (msgElement) msgElement.remove();
            input.removeAttribute('aria-describedby');
        }


        if (input.type === 'radio') {
            const fieldset = input.closest('fieldset');
            if (fieldset) {
                const oldMsgs = fieldset.querySelectorAll('.feedback-msg');
                oldMsgs.forEach(m => m.remove());

                const group = fieldset.querySelectorAll(`input[name="${input.name}"]`);
                group.forEach(r => r.removeAttribute('aria-describedby'));
            }
        }
    }


    // Start het script
    setupConditionalRequirements();
    setupLiveValidation();
    initStepper();
});