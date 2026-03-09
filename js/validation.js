// ==========================================
// --- js/validation.js ---
// ==========================================

export function validateSingleInput(veld) {
    const errorId = veld.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);

    if (!errorElement) return veld.checkValidity(); 

    if (!veld.checkValidity()) {
        errorElement.classList.remove('is-hidden');
        return false;
    } else {
        errorElement.classList.add('is-hidden');
        return true;
    }
}

export function setupLiveValidation() {
    const inputs = document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])');
    inputs.forEach(veld => {
        veld.addEventListener('blur', () => {
            validateSingleInput(veld);
        });
    });

    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            const errorId = radio.getAttribute('aria-describedby');
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement && radio.checkValidity()) {
                    errorElement.classList.add('is-hidden');
                }
            }
        });
    });
}

export function validateCurrentStep(currentStepEl) {
    const inputs = currentStepEl.querySelectorAll('input');
    let isStepValid = true;

    inputs.forEach(veld => {
        if (veld.type === 'button' || veld.type === 'submit') return;

        if (!veld.checkValidity()) {
            isStepValid = false; 

            const errorId = veld.getAttribute('aria-describedby');
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) errorElement.classList.remove('is-hidden');
            }
        } else {
            const errorId = veld.getAttribute('aria-describedby');
            if (errorId) {
                const errorElement = document.getElementById(errorId);
                if (errorElement) errorElement.classList.add('is-hidden');
            }
        }
    });

    return isStepValid;
}

export function clearMessages(veld) {
    const errorId = veld.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('is-hidden');
    }
}