// ==========================================================================================
// ------------------------------------ js/validation.js ------------------------------------
// setupLiveValidation, validateSingleInput, validateCurrentStep, showMessage, clearMessages.
// ==========================================================================================

export function setupLiveValidation() {
    const textInputs = document.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]):not([type="button"]):not([type="submit"])');
    
    textInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateSingleInput(input, false);
        });
    });
}

// const maken voor verschillende inputs

export function validateSingleInput(input, showText = false) {
    clearMessages(input);
    let isValid = true;

    input.classList.add('is-validated');

    if (!input.checkValidity()) {
        isValid = false;
        
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
        input.classList.remove('is-validated');
    }

    return isValid;
}

export function validateCurrentStep(currentStepEl) {
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

export function clearMessages(input) {
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