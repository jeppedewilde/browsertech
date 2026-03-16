// ========================
// --- js/validation.js ---
// ========================

// check validity + show error msg with aria-describedby
function checkVeld(input) {
    const errorId = input.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    
    if (!errorElement) return;

    if (!input.validity.valid) {
        errorElement.classList.remove('is-hidden'); 
    } else {
        errorElement.classList.add('is-hidden');
    }
}

// validation bij verlaten input field met blur & radio button met change
export function setupLiveValidation() {
    const alleInputs = document.querySelectorAll('input:not([type="button"]):not([type="submit"])');
    
    alleInputs.forEach(input => {
        // bij input verlaten
        input.addEventListener('blur', (event) => checkVeld(event.target));
        
        // radio button
        input.addEventListener('change', (event) => checkVeld(event.target));
    });
}

// volgende knop
export function validateCurrentStep(huidigeStap) {
    const inputs = huidigeStap.querySelectorAll('input:not([type="button"]):not([type="submit"])');
    inputs.forEach(input => checkVeld(input));

    const eersteFouteVeld = huidigeStap.querySelector('input:invalid');
    
    if (eersteFouteVeld) {
        eersteFouteVeld.focus(); 
        return false;           
    }

    return true; 
}

// meldingen verwijderen als velden onzichtbaar worden
export function clearMessages(input) {
    const errorId = input.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('is-hidden');
    }
}

// check bij submit button
export function setupSubmitValidation() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const alleInputs = form.querySelectorAll('input:not([type="button"]):not([type="submit"])');
        let formIsGeldig = true;
        let eersteFouteVeld = null;

        alleInputs.forEach(input => {
            checkVeld(input);

            if (!input.validity.valid) {
                formIsGeldig = false; 
                
                if (!eersteFouteVeld) {
                    eersteFouteVeld = input;
                }
            }
        });

        if (!formIsGeldig) {
            if (eersteFouteVeld) {
                eersteFouteVeld.focus();
            }
        } else {
            alert('Het formulier is succesvol verzonden.');
        }
    });
}