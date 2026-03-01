// ============================================
// MODAL LOADING & INITIALIZATION
// ============================================

/**
 * Loads the add employee modal from employee-add.html
 * Called once when the page loads
 */
function loadAddEmployeeModal() {
    const modalPath = './pages/employee-add.html'; // ✅ ADJUST PATH IF NEEDED
    
    console.log('📂 Fetching modal from:', modalPath);
    
    fetch(modalPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const modalContainer = document.getElementById('modalContainer');
            if (modalContainer) {
                modalContainer.innerHTML = html;
                console.log('✅ Modal loaded successfully');
                
                // Initialize modal elements after loading
                initializeModalElements();
            } else {
                console.error('❌ Modal container not found');
            }
        })
        .catch(error => {
            console.error('❌ Error loading modal:', error);
            alert('Failed to load employee modal. Please refresh the page.');
        });
}

/**
 * Initialize modal elements after they're added to DOM
 */
function initializeModalElements() {
    const modal = document.getElementById('addEmployeeModal');
    if (!modal) {
        console.error('❌ Modal element not found after loading');
        return;
    }

    // Setup modal event listeners
    setupModalListeners();

    console.log('✅ Modal elements initialized');
}

/**
 * Setup event listeners for modal close buttons
 */
function setupModalListeners() {
    const modal = document.getElementById('addEmployeeModal');
    if (!modal) return;

    // Close modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddEmployeeModal();
        }
    });

    console.log('✅ Modal listeners setup');
}

// ============================================
// MODAL OPEN/CLOSE FUNCTIONS
// ============================================

/**
 * Opens the Add Employee Modal
 */
function openAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    
    if (!modal) {
        console.error('❌ Modal not found. Loading modal...');
        loadAddEmployeeModal();
        setTimeout(() => openAddEmployeeModal(), 500);
        return;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // ✅ Prevent scrolling

    // Generate new Employee ID
    const empID = generateEmployeeID();
    const empIDInput = document.getElementById('employeeID');
    const qrIDInput = document.getElementById('qrEmployeeID');
    
    if (empIDInput) empIDInput.value = empID;
    if (qrIDInput) qrIDInput.value = empID;

    console.log('✅ Modal opened - New Employee ID:', empID);
}

/**
 * Closes the Add Employee Modal
 */
function closeAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // ✅ Allow scrolling again
        
        // Reset form
        const form = document.getElementById('addEmployeeForm');
        if (form) {
            form.reset();
        }

        // Reset to first tab
        setTimeout(() => {
            switchTab('profile');
        }, 100);

        console.log('✅ Modal closed');
    }
}

// ============================================
// TAB MANAGEMENT (From employee-add.html)
// ============================================

const requiredFields = {
    profile: ['firstName', 'lastName', 'gender', 'dob', 'phone', 'email', 'address', 'emergency'],
    employment: ['department', 'manager', 'shift', 'grade', 'contractType', 'probation'],
    documents: [],
    qr: []
};

function checkTabCompletion(tabName) {
    const fields = requiredFields[tabName];
    if (fields.length === 0) return true;

    return fields.every(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        const value = field.value.trim();
        return value !== '';
    });
}

function updateTabAvailability() {
    const profileComplete = checkTabCompletion('profile');
    const employmentComplete = checkTabCompletion('employment');

    const profileCompleteMsg = document.getElementById('profileCompleteMsg');
    const employmentCompleteMsg = document.getElementById('employmentCompleteMsg');

    if (profileCompleteMsg) {
        profileCompleteMsg.style.display = profileComplete ? 'flex' : 'none';
    }

    if (employmentCompleteMsg) {
        employmentCompleteMsg.style.display = employmentComplete ? 'flex' : 'none';
    }
}

function switchTab(tabName) {
    console.log('📑 Switching to tab:', tabName);

    // Hide all tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.add('hidden');
        tab.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
        selectedTab.classList.add('active');
    }

    // Update button styles
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-50', 'text-[#003D7A]', 'border-[#003D7A]');
        btn.classList.add('text-gray-600', 'border-transparent');
    });

    // Highlight active button
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active', 'bg-blue-50', 'text-[#003D7A]', 'border-[#003D7A]');
        activeButton.classList.remove('text-gray-600', 'border-transparent');
    }

    // Update progress bar
    const tabs = ['profile', 'employment', 'documents', 'qr'];
    const tabIndex = tabs.indexOf(tabName);
    if (tabIndex !== -1) {
        const progressPercent = ((tabIndex + 1) * 25);
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';
        }
        
        const tabCount = document.getElementById('tabCount');
        if (tabCount) {
            tabCount.textContent = (tabIndex + 1);
        }
    }
}

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

function addDocument() {
    const container = document.getElementById('documentsContainer');
    if (!container) return;

    const docRow = document.querySelector('.document-row');
    if (!docRow) return;

    const newRow = docRow.cloneNode(true);
    newRow.querySelectorAll('input, select').forEach(el => el.value = '');
    container.appendChild(newRow);
    
    console.log('✅ Document row added');
}

function removeDocument(btn) {
    const rows = document.querySelectorAll('.document-row');
    if (rows.length > 1) {
        btn.closest('.document-row').remove();
        console.log('✅ Document row removed');
    } else {
        alert('⚠️ Keep at least one document field');
    }
}

// ============================================
// EMPLOYEE ID GENERATION
// ============================================

function generateEmployeeID() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(3, '0');
    return `CLN-${year}-${random}`;
}

// ============================================
// FORM SUBMISSION
// ============================================

function submitAddEmployee() {
    const profileComplete = checkTabCompletion('profile');
    const employmentComplete = checkTabCompletion('employment');

    if (!profileComplete) {
        alert('⚠️ Please complete the Profile section');
        switchTab('profile');
        return;
    }

    if (!employmentComplete) {
        alert('⚠️ Please complete the Employment section');
        switchTab('employment');
        return;
    }

    const form = document.getElementById('addEmployeeForm');
    if (!form) {
        console.error('❌ Form not found');
        alert('Error: Form not found');
        return;
    }

    const employeeData = {
        employeeID: document.getElementById('employeeID').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        emergency: document.getElementById('emergency').value,
        department: document.getElementById('department').value,
        manager: document.getElementById('manager').value,
        shift: document.getElementById('shift').value,
        grade: document.getElementById('grade').value,
        contractType: document.getElementById('contractType').value,
        probation: document.getElementById('probation').value,
        createdAt: new Date().toISOString()
    };

    console.log('💾 Saving employee:', employeeData);

    // Save to localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    employees.push(employeeData);
    localStorage.setItem('employees', JSON.stringify(employees));

    // Clear draft
    localStorage.removeItem('employeeDraft');

    alert(`✅ Employee "${employeeData.firstName} ${employeeData.lastName}" added successfully!\n\nEmployee ID: ${employeeData.employeeID}`);
    
    closeAddEmployeeModal();
}

/**
 * Save form data as draft (can be incomplete)
 */
function saveProfileAsDraft() {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    const formData = new FormData(form);
    const draftData = {};

    formData.forEach((value, key) => {
        draftData[key] = value;
    });

    // Get current tab
    const activeTabs = document.querySelectorAll('.tab-content.active');
    if (activeTabs.length > 0) {
        const activeTabId = activeTabs[0].id;
        draftData.lastTab = activeTabId.replace('-tab', '');
    }

    localStorage.setItem('employeeDraft', JSON.stringify(draftData));
    alert('✅ Profile saved as draft!');
    console.log('✅ Draft saved');
}

/**
 * Load draft data if exists
 */
function loadDraftData() {
    const draftData = localStorage.getItem('employeeDraft');
    if (!draftData) return;

    const data = JSON.parse(draftData);
    const form = document.getElementById('addEmployeeForm');
    
    if (!form) return;

    Object.keys(data).forEach(key => {
        if (key === 'lastTab') {
            setTimeout(() => switchTab(data[key]), 100);
        } else {
            const field = form.elements[key];
            if (field) {
                field.value = data[key];
            }
        }
    });

    console.log('✅ Draft data loaded');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('addEmployeeModal');
        if (modal && !modal.classList.contains('hidden')) {
            closeAddEmployeeModal();
        }
    }
});

// ============================================
// PAGE LOAD - Initialize Modal
// ============================================

window.addEventListener('load', function() {
    console.log('🚀 Page loaded - Loading modal...');
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        loadAddEmployeeModal();
    }, 500);
});