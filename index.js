// Susikurti 2 puslapius, 1 - registracija ir login, 
// saugoti i duomenu baze, 2 yra notes listas, kuris 
// bus skirtas tik tam prisijungusiam useriui, jeigu 
// useris pasikeicia, rodomi jam priklausantys note'sai. 
// Stiliu palieku jums.

// susikurkite 2 column duombazei useriams ir postams, 
// ir priskirkite postui useri, pagal ka galesi filtruoti
//  postus

// gal dar pirmame puslapyje butu du pasirinkimai tarp 
// login ir registracijos, regitracijoje mail pasword ir
//  repeat pass, o login mail ir pass


// tada po sekmingo logino perkelimas i kita puslapi

const btnReg = document.querySelector('#btn-register');
const formReg = document.querySelector('#registration-form');
const registrationBox = document.querySelector('#registration-box');

let userArr = [];

const btnLog = document.querySelector('#btn-log');
const failLogMessage = document.querySelector('#fail-log');
const formLog = document.querySelector('#log-in');
const logInBox = document.querySelector('#log-in-box');
const logOut = document.querySelector('#btn-out');

const notes = document.querySelector('#user-notes');
const formNotes = document.querySelector('#form-note');
const notesBox = document.querySelector('#notes-box');

let notesArr = [];
let logedInUser;
let userNotes = [];

if(localStorage.getItem('User')) {
    logedInUser = JSON.parse(localStorage.getItem('User'));
}

fetch('https://testapi.io/api/inga/resource/users')
.then((response) =>{
    if(response.ok) {
        return response.json();
    }
})
.then((result) => {
    userArr = result.data;
    console.log(userArr);
});

fetch('https://testapi.io/api/inga/resource/notes')
.then((response) =>{
    if(response.ok) {
        return response.json();
    }
})
.then((result) => {
    notesArr = result.data;
    if (logedInUser){
        userNotes = notesArr.filter((note) => {
            if(logedInUser.id === note.user_id) {
                return true;
            }
            return false;
        })
        render(userNotes);
        logInBox.style.display = 'none';
        registrationBox.style.display = 'none';
        notes.style.display = 'block';
        logOut.style.display = 'block';
    }
   
    console.log(notesArr);
});

const render = (userNotes) => {
    notesBox.innerHTML = '';
    userNotes.forEach((note) => {
    renderNote(note);
    })
}

formNotes.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = event.target.elements.noteText.value;
    const noteUser = logedInUser.id;

    fetch('https://testapi.io/api/inga/resource/notes', 
    {   
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            note: note,
            user_id: noteUser,
        })
    })
    .then((response) =>{
        if(response.ok) {
            return response.json();
        }
    })
    .then((result) => {
        userNotes.push(result);
        notesArr.push(result);
        render(userNotes);
    });
})

const renderNote = (userNote) => {
    const noteP =  document.createElement('p');
    noteP.textContent = `Your note: ${userNote.note}`;
    notesBox.append(noteP);
}

logOut.addEventListener('click', () => {
    localStorage.removeItem('User');
    location.reload();
})

formReg.addEventListener('submit', (event) => {
    // event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const repeatPsw = event.target.elements.repeatPassword.value;

    fetch('	https://testapi.io/api/inga/resource/users',
    {   method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
    .then((response) =>{
        if(response.ok) {
            return response.json();
        }
    })
    .then((result) => {
        userArr.push(result);
        console.log(userArr);
    });

    if(password === repeatPsw) {
        alert('Succesful registration. You can log in.');
    } else{
        alert ('Registration failed');
    }
})

formLog.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const filteredUsers = userArr.filter((user) => {
        if(user.email === email && user.password === password) {
            return true;
        }
        return false;
    })
    //user loged in
    if(filteredUsers[0]) {
        logedInUser = filteredUsers[0];
        userNotes = notesArr.filter((note) => {
            if(logedInUser.id === note.user_id) {
                return true;
            }
            return false;
        })
        console.log(userNotes);
        
        logInBox.style.display = 'none';
        registrationBox.style.display = 'none';
        notes.style.display = 'block';
        logOut.style.display = 'block';

        render(userNotes);
        
        localStorage.setItem('User', JSON.stringify(logedInUser));
    } else {
        failLogMessage.style.display = 'block';
    }
})