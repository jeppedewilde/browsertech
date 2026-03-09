// ============================================================================
// ---------------------------- js/conditions.js ----------------------------
// ============================================================================

import { clearMessages } from './validation.js';

export function setupConditionalRequirements() {
    
    // --- HOOFDSTUK 1 LOGICA ---
    const toggleRequired = (isConditionMet, elements) => {
        elements.forEach(el => {
            if (!el) return; 
            if (isConditionMet) {
                el.setAttribute('required', 'required');
            } else {
                el.removeAttribute('required');
                clearMessages(el);
                el.classList.remove('is-validated');
            }
        });
    };

    const updateConditions = () => {
        const isMarried = document.querySelector('input[name="relationship"][value="married"]')?.checked;
        toggleRequired(isMarried, [
            ...document.querySelectorAll('input[name="conditions"], input[name="final-settlement"]'),
            document.getElementById('date-conditions')
        ]);

        const hasChildren = document.querySelector('input[name="children"][value="children"]')?.checked;
        toggleRequired(hasChildren, [
            ...document.querySelectorAll('input[name="child-deceased"], input[name="child-has-children"]')
        ]);

        const hasTestament = document.querySelector('input[name="testament"][value="testament"]')?.checked;
        toggleRequired(hasTestament, [
            document.getElementById('protocol-number'),
            document.getElementById('initials-notary'),
            document.getElementById('lname-notary'),
            document.getElementById('location'),
            document.getElementById('date-changes')
        ]);
    };

    const triggers = document.querySelectorAll('input[name="relationship"], input[name="children"], input[name="testament"]');
    triggers.forEach(radio => radio.addEventListener('change', updateConditions));
    updateConditions();

    // --- HOOFDSTUK 2 LOGICA ---
    const adresRadios = document.querySelectorAll('input[name="residence-type"]');
    adresRadios.forEach(radio => radio.addEventListener('change', adresWeergave));

    const idRadios = document.querySelectorAll('input[name="id-type"]');
    idRadios.forEach(radio => radio.addEventListener('change', idWeergave));

    // Draai ze direct 1 keer bij het laden
    adresWeergave();
    idWeergave();
}

// =====================================
// --- HOOFDSTUK 2 FUNCTIES ------------
// =====================================

// Adres Binnenland/Buitenland 
export function adresWeergave() {
    const nlRadio = document.getElementById('residence-nl');
    const nlBlok = document.getElementById('address-nl-wrapper');
    const buitenlandBlok = document.getElementById('address-abroad-wrapper');

    if (!nlRadio || !nlBlok || !buitenlandBlok) return; // Veiligheidscheck

    const nlVelden = nlBlok.querySelectorAll('input:not(#addition)');
    const buitenlandVelden = buitenlandBlok.querySelectorAll('input');

    if (nlRadio.checked) {
        nlBlok.classList.remove('is-hidden');
        buitenlandBlok.classList.add('is-hidden');
        nlVelden.forEach(veld => veld.setAttribute('required', 'required'));
        buitenlandVelden.forEach(veld => veld.removeAttribute('required'));
    } else {
        nlBlok.classList.add('is-hidden');
        buitenlandBlok.classList.remove('is-hidden');
        nlVelden.forEach(veld => veld.removeAttribute('required'));
        buitenlandVelden.forEach(veld => veld.setAttribute('required', 'required'));
    }
}

// Functie voor BSN / Becon / Protocol switch
export function idWeergave() {
    const bsnRadio = document.getElementById('id-type-bsn');
    const beconRadio = document.getElementById('id-type-becon');
    
    const bsnBlok = document.getElementById('wrapper-bsn');
    const beconBlok = document.getElementById('wrapper-becon');
    const protocolBlok = document.getElementById('wrapper-protocol');

    const bsnVeld = document.getElementById('bsn-rsin');
    const beconVeld = document.getElementById('becon-number');
    const protocolVeld = document.getElementById('protocol-number2');

    bsnBlok.classList.add('is-hidden');
    beconBlok.classList.add('is-hidden');
    protocolBlok.classList.add('is-hidden');
    
    if(bsnVeld) bsnVeld.removeAttribute('required');
    if(beconVeld) beconVeld.removeAttribute('required');
    if(protocolVeld) protocolVeld.removeAttribute('required');

    if (bsnRadio.checked) {
        bsnBlok.classList.remove('is-hidden');
        if(bsnVeld) bsnVeld.setAttribute('required', 'required');
    } else if (beconRadio && beconRadio.checked) {
        beconBlok.classList.remove('is-hidden');
        if(beconVeld) beconVeld.setAttribute('required', 'required');
    } else {
        protocolBlok.classList.remove('is-hidden');
        if(protocolVeld) protocolVeld.setAttribute('required', 'required');
    }
}

// =====================================
// --- STEPPER ROUTING LOGIC -----------
// =====================================

export function determineNextStep(currentIndex, totalSteps) {
    const relValue = document.querySelector('input[name="relationship"]:checked')?.value;
    const conditionsValue = document.querySelector('input[name="conditions"]:checked')?.value;
    const childValue = document.querySelector('input[name="children"]:checked')?.value;
    const testValue = document.querySelector('input[name="testament"]:checked')?.value;

    if (currentIndex === 1 && relValue === 'not-married') return 5;
    if (currentIndex === 2 && conditionsValue === 'no-conditions') return 5;
    if (currentIndex === 5 && childValue === 'no-children') return 8;
    if (currentIndex === 8 && testValue === 'no-testament') return totalSteps; 

    return currentIndex + 1; 
}