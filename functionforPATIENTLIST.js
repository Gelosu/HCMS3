

    var addPatientModal = document.getElementById("addPatientModal")
    var editPatientModal = document.getElementById("editPatientModal")

//PATIENTS
function submitPatientForm(event) {
    event.preventDefault(); 

    var formData = new FormData(document.getElementById('addpatient')); 

    fetch('PATIENTLIST/patientprocess.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        console.log('Success:', data);
        if (data.error) {
            alert('Error: ' + data.error);
        } else {

            if (Array.isArray(data.patients)) {

                updatePatientTable(data.patients);
            } else {
                console.error('Expected an array of patients but got:', data.patients);
                alert('Failed to retrieve patient data.');
            }
            closeAddPatientModal();
        }
    })
    .catch(error => console.error('Error submitting form:', error));
}


/// Function to update the medicine table with new data
function updateMedicineTable(medicines) {
    var tableBody = document.querySelector('#medTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    if (medicines.length > 0) {
        medicines.forEach(med => {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.meds_number}</td>
                <td>${med.meds_name}</td>
                <td>${med.med_dscrptn}</td>
                <td>${med.stock_in}</td>
                <td>${med.stock_out}</td>
                <td>${med.stock_exp}</td>
                <td>${med.stock_avail}</td>
                <td class='action-icons'>
                    <button onclick="openEditMed(
                        '${med.med_id}', 
                        '${med.meds_number}', 
                        '${med.meds_name}', 
                        '${med.med_dscrptn}', 
                        ${med.stock_in}, 
                        ${med.stock_out}, 
                        '${med.stock_exp}', 
                        ${med.stock_avail}
                    )">
                        Edit
                    </button>
                    <button onclick="deleteMedicine(${med.med_id})">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="8">No medicines found</td></tr>'; // Adjust colspan to match the number of columns
    }
}


// Function to close the add patient modal
function closeAddPatientModal() {
    if (addPatientModal) {
        addPatientModal.style.display = 'none';
    }
}

// Function to open the add patient modal
function openAddPatientModal() {
    if (addPatientModal) {
        addPatientModal.style.display = 'block'; 
    }
}


//UPDATE FUNCTION
// Function to open the edit patient modal and populate it with data
function openEditPatient(patientId, name, age, birthday, address, contactPerson, type) {
    document.getElementById('editPatientId').value = patientId;
    document.getElementById('editName').value = name;
    document.getElementById('editAge').value = age;
    document.getElementById('editBirthday').value = birthday;
    document.getElementById('editAddress').value = address;
    document.getElementById('editContactPerson').value = contactPerson;
    document.getElementById('editType').value = type;

    // Show the modal
    var editPatientModal = document.getElementById('editPatientModal');
    editPatientModal.style.display = 'block';
}

// Function to close the edit patient modal
function closeEditPatientModal() {
    var editPatientModal = document.getElementById('editPatientModal');
    editPatientModal.style.display = 'none';
}

// Function to handle the form submission for editing a patient
function submitEditPatientForm(event) {
    event.preventDefault(); 

    var formData = new FormData(document.getElementById('editPatientForm')); 

    fetch('PATIENTLIST/update_patient.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) 
    .then(text => {
        let data;
        try {
            data = JSON.parse(text); 
        } catch (error) {
            throw new Error('Failed to parse JSON response: ' + error.message);
        }

        console.log('Success:', data); 
        if (data.error) {
            alert('Error: ' + data.error); 
        } else {
            updatePatientTable(data.patients); 
            closeEditPatientModal(); 
        }
    })
    .catch(error => console.error('Error submitting form:', error)); 
}

//Delete function
function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        fetch('PATIENTLIST/delete_patient.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'patientId': patientId
            })
        })
        .then(response => {
        
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Unexpected content type: ' + contentType);
            }
        })
        .then(data => {
            if (data.success) {
                updatePatientTable(data.patients); 
                document.querySelector(`#patientRow${patientId}`).remove(); 
            } else {
                alert('Error: ' + data.message); 
            }
        })
        .catch(error => console.error('Error deleting record:', error)); 
    }
}

