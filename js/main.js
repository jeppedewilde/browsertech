// ==================
// --- js/main.js ---
// ==================

import { setupLiveValidation } from './validation.js';
import { setupConditionalRequirements } from './conditions.js';
import { initializeStepper } from './stepper.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Zet de logica (required attributen) klaar
    setupConditionalRequirements();
    
    // 2. Zet de validatie (rood/groen kleuren) klaar
    setupLiveValidation();
    
    // 3. Start de presentatie (stappen tonen en verbergen)
    initializeStepper();
});