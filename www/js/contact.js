// form
const form = document.querySelector("#contact-form");

// inputs
const userName = document.querySelector("#form-contact-userName-input");
const userEmail = document.querySelector("#form-contact-userEmail-input");
const messageTopic = document.querySelector("#form-contact-messageTopic-input")
const userMessage = document.querySelector("#form-contact-userMessage-input");

// checkboxes
const regulation = document.querySelector("#form-contact-regulation-input");
const privacy = document.querySelector("#form-contact-privacy-input");

const isError = [];

const submitButtonActive = document.querySelector("button.button");
submitButtonActive.disabled = true;

let ifUserNameIsError = true;
let ifUserEmailIsError = true;
let ifMessageTopicIsError = true;
let ifRegulationIsError = true;
let ifPrivacyIsError = true;

const formInputElements = [userName, userEmail, messageTopic, userMessage]; 

const writeInputWarning = (fieldId) => {
        const box = document.createElement("div");
        box.classList.add("container");
        box.classList.add(`form-info-${fieldId}`);
        const p = document.createElement("p");
        box.append(p);
        p.classList.add("has-text-danger");
        p.innerText = `Wypełnienie powyższego pola jest wymagane`;
        return box
}

const isWarningDisplayed = (parenContainer, infoContainer, value, id) => {
    if( parenContainer.contains(infoContainer) === false && (
        infoContainer === null || 
        infoContainer === 'undefined')){
        if( (value === null) || 
            (value === undefined) ||
            (value === ""))
                {
                    const elementName = parenContainer.firstElementChild.innerText;
                    isError.push(`Wymagane jest poprawne wypełnienie ${elementName}`)
                    return parenContainer.append(writeInputWarning(id));
                }
    }else if(parenContainer.contains(infoContainer) === true){
        if( (value.length > 0)){
            isError.pop();
            return parenContainer.removeChild(infoContainer);
        }
    }
}

//  Czas wysłania wiadomości 
// const date = () => {
//     const ifSingleChar = (n) => {
    //         return (n < 10) ? `0${n}` : `${n}`;
    //     }
    //     const now = new Date();
    //     const hours = ifSingleChar(now.getHours());
    //     const minutes = ifSingleChar(now.getMinutes());
    //     const sek = ifSingleChar(now.getSeconds());
    //     const day = ifSingleChar(now.getDate());
    //     const month = ifSingleChar(now.getMonth() + 1);
    //     const year = ifSingleChar(now.getFullYear());
    //     return `${hours}/${minutes}/${sek}/${day}/${month}/${year}`
    // }

const checkCheckbox = () => {
    if(privacy.checked !== true){
        writeInputWarning()
        isError.push(`Wymagane jest poprawne wypełnienie ${elementName}`);
    }else{
        isError.pop();
    }
    
    if(regulation.checked !== true){
        isError.push(`Wymagane jest poprawne wypełnienie ${elementName}`);
    }else{
    isError.pop();
    }   
}

const ifError = (isError) => {
    if(isError.length === 0){
        console.log(isError);
        console.log("OK");
        submitButtonActive.disabled = false;
    }else if(isError.length !== 0){
        console.log("STOP");
        console.log(isError);
        submitButtonActive.disabled = true;
        
    }
}

const checkFromElements = (elements) => {
    elements.forEach(element => {
        element.addEventListener("focusout", _ => {
            const {id, value} = element;
            const parenContainer= element.closest("div.field");
            const componentId = id;
            const infoContainer = document.querySelector(`div.field div.form-info-${componentId}`);
            isWarningDisplayed(parenContainer, infoContainer, value, componentId);
            ifError(isError)
        })
    })
}

checkFromElements(formInputElements);

form.addEventListener("submit", e => {
    if(isError.length === 0){
        e.preventDefault();
        console.log(isError);
        console.log("OK");
        // do wyslania
        const message = formInputElements.map(el => el.value.trim());
    }else if(isError.length !==0){
        console.log("STOP");
        console.log(isError);
        // document.querySelector("button.button").
    }
})