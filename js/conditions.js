// ================================================
// --------------- js/conditions.js ---------------
// setupConditionalRequirements, determineNextStep.
// ================================================

import {
    clearMessages
} from './validation.js';

export function setupConditionalRequirements() {
    const relationshipRadios = document.querySelectorAll('input[name="relationship"]');
    const childrenRadios = document.querySelectorAll('input[name="children"]');
    const testamentRadios = document.querySelectorAll('input[name="testament"]');

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
                el.classList.remove('is-validated');
            }
        });
    }

    function updateTestamentRequirements() {
        const hasTestamentInput = document.querySelector('input[name="testament"][value="testament"]');
        const hasTestament = hasTestamentInput ? hasTestamentInput.checked : false;

        const notaryFields = [
            document.getElementById('protocol-number'),
            document.getElementById('initials-notary'),
            document.getElementById('lname-notary'),
            document.getElementById('location'),
            document.getElementById('date-changes')
        ];

        notaryFields.forEach(el => {
            if (el) {
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

    // =====================================
    // --- PATTERN: SELECTIVE DISCLOSURE ---
    // =====================================

    // Een super-slimme herbruikbare functie voor "Toon/Verberg" blokken
    function setupSelectiveDisclosure(radioName, wrapperMap, exceptions = []) {
        const radios = document.querySelectorAll(`input[name="${radioName}"]`);
        if (radios.length === 0) return;

        function updateVisibility() {
            // Zoek welke radiobutton NU is geselecteerd
            const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
            if (!checkedRadio) return;
            const selectedValue = checkedRadio.value;

            // Loop door alle wrappers die we hebben doorgegeven
            for (const [radioValue, wrapperId] of Object.entries(wrapperMap)) {
                const wrapper = document.getElementById(wrapperId);
                if (!wrapper) continue;

                if (radioValue === selectedValue) {
                    // Deze is gekozen: Toon hem en maak de inputs required
                    wrapper.classList.remove('is-hidden');
                    setFieldsRequired(wrapper, true, exceptions);
                } else {
                    // Deze is niet gekozen: Verberg hem en haal required weg
                    wrapper.classList.add('is-hidden');
                    setFieldsRequired(wrapper, false, exceptions);
                }
            }
        }

        // Hulpfunctie om required aan/uit te zetten voor alle inputs in een div
        function setFieldsRequired(container, isRequired, skipIds) {
            const inputs = container.querySelectorAll('input');
            inputs.forEach(input => {
                // Sla optionele velden (zoals huisnummertoevoeging) over
                if (skipIds.includes(input.id)) return;

                if (isRequired) {
                    input.setAttribute('required', 'required');
                } else {
                    input.removeAttribute('required');
                    clearMessages(input); // Geïmporteerd uit validation.js
                    input.classList.remove('is-validated');
                }
            });
        }

        // Luister naar kliks op de radiobuttons
        radios.forEach(radio => radio.addEventListener('change', updateVisibility));

        // Draai direct 1 keer bij het inladen
        updateVisibility();
    }

    // 1. Start de logica voor de 3 ID-velden (BSN, Becon of Protocol)
    setupSelectiveDisclosure('id-type', {
        'bsn': 'wrapper-bsn',
        'becon': 'wrapper-becon',
        'protocol': 'wrapper-protocol'
    });

    // 2. Start de logica voor de Adresvelden (NL of Buitenland)
    // We geven ['addition'] mee als uitzondering, want een toevoeging is nooit required!
    setupSelectiveDisclosure('residence-type', {
        'nl': 'address-nl-wrapper',
        'abroad': 'address-abroad-wrapper'
    }, ['addition']);

    relationshipRadios.forEach(radio => radio.addEventListener('change', updateRelationshipRequirements));
    childrenRadios.forEach(radio => radio.addEventListener('change', updateChildrenRequirements));
    testamentRadios.forEach(radio => radio.addEventListener('change', updateTestamentRequirements));

    updateRelationshipRequirements();
    updateChildrenRequirements();
    updateTestamentRequirements();
}

export function determineNextStep(currentIndex, totalSteps) {
    let nextIndex = currentIndex + 1;

    if (currentIndex === 1) {
        const relationshipAnswer = document.querySelector('input[name="relationship"]:checked');
        if (relationshipAnswer && relationshipAnswer.value === 'not-married') nextIndex = 5;
    }

    if (currentIndex === 5) {
        const childrenAnswer = document.querySelector('input[name="children"]:checked');
        if (childrenAnswer && childrenAnswer.value === 'no-children') nextIndex = 8;
    }

    if (currentIndex === 8) {
        const testamentAnswer = document.querySelector('input[name="testament"]:checked');
        if (testamentAnswer && testamentAnswer.value === 'no-testament') {
            nextIndex = totalSteps;
        }
    }

    return nextIndex;
}