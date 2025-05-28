

document.addEventListener("DOMContentLoaded", () => {
    // --- Splash Screen logic ---
    setTimeout(() => {
        const splash = document.getElementById("splash");
        splash.classList.add("fade-out");
        setTimeout(() => {
            splash.style.display = "none";
            document.getElementById("welcome-section").classList.remove("hidden");
        }, 1000);
    }, 1000);

    // --- Modal logic ---
    const loginModal = document.getElementById("login-modal");
    const signupModal = document.getElementById("signup-modal");
    const overlay = document.getElementById("overlay");
    const loginButton = document.querySelector("#welcome-section button:first-child");
    const signupButton = document.querySelector("#welcome-section button:last-child");

    // Βοηθητική συνάρτηση για επαναφορά φόρμας
    const resetForm = (formId) => {
        const form = document.querySelector(`#${formId}`);
        if (form) {
            form.querySelectorAll('input').forEach(input => {
                if (input.type !== 'submit') input.value = '';
            });
            const errors = form.querySelectorAll('.error');
            errors.forEach(error => error.remove());
        }
    };

    // Έλεγχος για server-side flags
    if (typeof window.showLoginModal !== "undefined" && window.showLoginModal === "true") {
        loginModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    if (typeof window.showSignupModal !== "undefined" && window.showSignupModal === "true") {
        signupModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        
        if (!document.querySelector('#signup-modal .error')) {
            resetForm('signup-modal');
        }
    }

    // Show login modal
    loginButton.addEventListener("click", () => {
        loginModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        resetForm('login-modal');
    });

    // Show signup modal
    signupButton.addEventListener("click", () => {
        signupModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        resetForm('signup-modal');
    });

    // Close modals
    overlay.addEventListener("click", () => {
        [loginModal, signupModal].forEach(modal => modal.classList.add("hidden"));
        overlay.classList.add("hidden");
        
        // Επαναφορά όλων των φορμών
        resetForm('login-modal');
        resetForm('signup-modal');
    });

    // Διατήρηση overlay ορατού όταν υπάρχει error
    if (document.querySelector('.error')) {
        overlay.classList.remove("hidden");
    }
});


  // Λίστα περιοχών Πάτρας 
const patrasAreas = [
    "Αγία Αικατερίνη", "Αγία Βαρβάρα", "Αγία Σοφία", "Αγία Τριάδα",
    "Άγιοι Απόστολοι", "Άγιος Αλέξιος", "Άγιος Ανδρέας", "Άγιος Γεράσιμος",
    "Άγιος Γεώργιος Λάγγουρα", "Άγιος Δημήτριος", "Άγιος Διονύσιος", "Αγυιά",
    "Αμπελόκηποι", "Αναπηρικά Ιτεών", "Άνθεια", "Ανθούπολη", "Αρόη", "Ασύρματος",
    "Βλατερό", "Βουδ", "Γλαράκη", "Γαλαξιδιώτικα", "Γεραναίικα", "Γηροκομείο",
    "Γκαζοχώρι", "Γούβα", "Δάφνες", "Δασύλλιο", "Δεμένικα", "Δεξαμενή", "Διάκου",
    "Δροσιά", "Εβραιομνήματα", "Εγγλέζικα", "Εγλυκάδα", "Εσχατοβούνι", "Ζαβλάνι",
    "Ζαρουχλέικα", "Ιτιές", "Καντριάνικα","Κέντρο" , "Καστελλόκαμπος", "Κλουκινιώτικα",
    "Κόκκινος Μύλος", "Κοτρώνι", "Κουκούλι", "Κούτσα", "Κρητικά", "Κρύα Ιτεών",
    "Κυνηγού", "Κυψέλη", "Λαδόπουλου", "Λεύκα", "Λιαπαίικα", "Λυκοχορός",
    "Μαγουλιανίτικα", "Μακρυγιάννη", "Μαντζαβιναίικα", "Μαρκάτο", "Μαρούδα",
    "Μεταμόρφωση Σωτήρος", "Μπάλα", "Μπεγουλάκι", "Νεάπολη", "Παγώνα",
    "Παναγία Αλεξιώτισσα", "Περιβόλα", "Πόρτες", "Πράτσικα", "Προάστιο",
    "Προφήτης Ηλίας", "Ριγανόκαμπος", "Ρομάντζα", "Σύνορα", "Σαμακιά",
    "Σκαγιοπούλειο", "Σκιόεσσα", "Συχαινά", "Τέρψη", "Ταμπάχανα", "Ταραμπούρα",
    "Τάσι", "Τερψιθέα", "Τζίνη", "Τριτάκη", "Τσιβδί", "Χαλκωματά", "Ψάχου",
    "Ψαροφάι", "Ψηλαλώνια"]


document.addEventListener("DOMContentLoaded", () => {
    const areaInput = document.getElementById("signup-area");
    const suggestions = document.getElementById("area-suggestions");
    const signupModal = document.getElementById("signup-modal");
    const defaultAreaValue = ""; 

    areaInput.addEventListener("input", () => {
        const input = areaInput.value.toLowerCase();
        suggestions.innerHTML = '';

        if (input.length < 2) {
            suggestions.style.display = 'none';
            return;
        }

        const matchedAreas = patrasAreas.filter(area =>
            area.toLowerCase().includes(input)
        );

        if (matchedAreas.length > 0) {
            matchedAreas.forEach(area => {
                const div = document.createElement("div");
                div.textContent = area;
                div.addEventListener("click", () => {
                    areaInput.value = area;
                    suggestions.style.display = 'none';
                });
                suggestions.appendChild(div);
            });
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });

    // Κλείσιμο suggestions και reset περιοχής αν κλικάρεις έξω από το modal
    document.addEventListener("click", (e) => {
        const clickedOutsideModal = !signupModal.contains(e.target);
        const clickedOutsideInput = e.target !== areaInput;
        const clickedOutsideSuggestions = !suggestions.contains(e.target);

        if (clickedOutsideModal && clickedOutsideInput && clickedOutsideSuggestions) {
            areaInput.value = defaultAreaValue;
        }

        if (clickedOutsideInput && clickedOutsideSuggestions) {
            suggestions.style.display = 'none';
        }
    });
});

document.getElementById("signup-modal").addEventListener("submit", (e) => {
    const areaInput = document.getElementById("signup-area");
    const areaValue = areaInput.value.trim();

    if (!patrasAreas.includes(areaValue)) {
        e.preventDefault(); // Σταματάμε το submit
        alert("Παρακαλώ επιλέξτε έγκυρη περιοχή από τη λίστα.");
        areaInput.focus();
    }
});

// Debug: Εμφάνισε ποια στοιχεία λείπουν
const requiredElements = [
  'splash', 'welcome-section', 'login-modal', 
  'signup-modal', 'overlay', 'signup-area'
];

missingElements = requiredElements.filter(id => !document.getElementById(id));
if (missingElements.length > 0) {
  console.log("⚠️ Τα ακόλουθα στοιχεία λείπουν:", missingElements);
}