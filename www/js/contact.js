// form
const form = document.querySelector("#contact-form");

// inputs
const formContactUserNameInput = document.querySelector("#form-contact-userName-input");
const formContactUserNameHelp = document.querySelector("#form-contact-userName-help");

const formContactUserEmailInput = document.querySelector("#form-contact-userEmail-input");
const formContactUserEmailHelp  = document.querySelector("#form-contact-userEmail-help");

const formContactMessageTopicInput = document.querySelector("#form-contact-messageTopic-input");
const formContactMessageTopicHelp = document.querySelector("#form-contact-messageTopic-help");

const formContactUserMessageInput = document.querySelector("#form-contact-userMessage-input");
const formContactUserMessageHelp = document.querySelector("#form-contact-userMessage-help");


// checkboxes
const formContactCheckboxRegulationInput = document.querySelector("#form-contact-regulation-input");
const formContactCheckboxRegulationHelp = document.querySelector("#form-contact-regulation-help");
const formContactCheckboxPrivacyInput = document.querySelector("#form-contact-privacy-input");
const formContactCheckboxPrivacyHelp = document.querySelector("#form-contact-privacy-help");


// submit button
const formContactSubmitButton = document.querySelector("button.button");

let isUserNameIsFill = false;

let isUserEmailIsFill = false;

let isMessageTopicIsFill = false;

let isUserMessageIsFill = false;

let isRegulationIsAccepted = false;

let isPrivacyIsAccepted = false;

// ----------------------------------------------------------------------------

const resetFormContact = () => {
    if((isUserNameIsFill        &&  
        isUserEmailIsFill       &&  
        isMessageTopicIsFill    &&  
        isUserMessageIsFill     &&  
        isRegulationIsAccepted  && 
        isPrivacyIsAccepted)){
        formContactSubmitButton.classList.remove("is-disabled");
        formContactSubmitButton.disabled = false;
    }else{
        formContactSubmitButton.classList.add("is-disabled");
        formContactSubmitButton.disabled = true;
    }
}

const onContactFormUserName = event => {
    if(formContactUserNameInput.value.length < 1){
        formContactUserNameInput.classList.remove("is-success");
        formContactUserNameInput.classList.add("is-danger");
        formContactUserNameHelp.classList.remove("is-success");
        formContactUserNameHelp.classList.add("is-danger");
        formContactUserNameHelp.textContent = `Powyższe pole musi zostać wypełnione`;
        isUserNameIsFill = false;

    }else if(formContactUserNameInput.value.length > 40){
        formContactUserNameInput.classList.remove("is-success");
        formContactUserNameInput.classList.add("is-danger");
        formContactUserNameHelp.classList.remove("is-success");
        formContactUserNameHelp.classList.add("is-danger");
        formContactUserNameHelp.textContent = `Maksymalna dopuszczalna liczba znaków jest równa 40`;
        isUserNameIsFill = false;
    }else{
        formContactUserNameInput.classList.remove("is-danger");
        formContactUserNameInput.classList.add("is-success");
        formContactUserNameHelp.classList.remove("is-danger");
        formContactUserNameHelp.classList.add("is-success");
        formContactUserNameHelp.textContent = ``;
        isUserNameIsFill = true;
    }
    resetFormContact();
};

const onContactFormUserEmail = event => {
    if (formContactUserEmailInput.validity.valueMissing) {
        formContactUserEmailInput.classList.remove("is-success");
        formContactUserEmailInput.classList.add("is-danger");
        
        formContactUserEmailHelp.classList.remove("is-success");
        formContactUserEmailHelp.classList.add("is-danger");
        formContactUserEmailHelp.textContent = `powyższe pole musi zostać wypełnione`;
        isUserEmailIsFill = false;
    }
    else if (formContactUserEmailInput.validity.typeMismatch) {
        formContactUserEmailInput.classList.remove("is-success");
        formContactUserEmailInput.classList.add("is-danger");
        
        formContactUserEmailHelp.classList.remove("is-success");
        formContactUserEmailHelp.classList.add("is-danger");
        formContactUserEmailHelp.textContent = `podany email nie jest prawdiłowy`;
        isUserEmailIsFill = false;
    }else if(formContactUserEmailInput.value.length > 60) {
        formContactUserEmailInput.classList.remove("is-success");
        formContactUserEmailInput.classList.add("is-danger");

        formContactUserEmailHelp.classList.remove("is-success");
        formContactUserEmailHelp.classList.add("is-danger");
        formContactUserEmailHelp.textContent = `maksymalna dopuszczalna liczba znaków jest równa 60`;
        isUserEmailIsFill = false;
    }else{
        formContactUserEmailInput.classList.remove("is-danger");
        formContactUserEmailInput.classList.add("is-success");

        formContactUserEmailHelp.classList.remove("is-danger");
        formContactUserEmailHelp.classList.add("is-success");
        formContactUserEmailHelp.textContent = ``;
        isUserEmailIsFill = true;
    }
    resetFormContact();
};

const onContactFormMessageTopic = event => {
    if(formContactMessageTopicInput.value.length > 40){
        formContactMessageTopicInput.classList.remove("is-success");
        formContactMessageTopicInput.classList.add("is-danger");
        formContactMessageTopicHelp.classList.remove("is-success");
        formContactMessageTopicHelp.classList.add("is-danger");
        formContactMessageTopicHelp.textContent = `maksymalna liczba znaków jest równa 40`;
        isMessageTopicIsFill = false;
    }else{
        formContactMessageTopicInput.classList.remove("is-danger");
        formContactMessageTopicInput.classList.add("is-success");
        formContactMessageTopicHelp.classList.remove("is-danger");
        formContactMessageTopicHelp.classList.add("is-success");
        formContactMessageTopicHelp.textContent = ``;
        isMessageTopicIsFill = true;
    }
    resetFormContact();
};

const onContactFormUserMessage = event => {
    if(formContactUserMessageInput.value.length < 1){
        formContactUserMessageInput.classList.remove("is-success");
        formContactUserMessageInput.classList.add("is-danger");
        formContactUserMessageHelp.classList.remove("is-success");
        formContactUserMessageHelp.classList.add("is-danger");
        formContactUserMessageHelp.textContent = `powyższe pole musi zostać wypełnione`;
        isUserMessageIsFill = false;

    }else if(formContactUserMessageInput.value.length > 500){
        formContactUserMessageInput.classList.remove("is-success");
        formContactUserMessageInput.classList.add("is-danger");
        formContactUserMessageHelp.classList.remove("is-success");
        formContactUserMessageHelp.classList.add("is-danger");
        formContactUserMessageHelp.textContent = `maksymalna liczba znaków jest równa 500`;
        isUserMessageIsFill = false;
    }else{
        formContactUserMessageInput.classList.remove("is-danger");
        formContactUserMessageInput.classList.add("is-success");
        formContactUserMessageHelp.classList.remove("is-danger");
        formContactUserMessageHelp.classList.add("is-success");
        formContactUserMessageHelp.textContent = ``;
        isUserMessageIsFill = true;
    }
    resetFormContact();
};


const onContactFormRegulation = event => {
    if(!formContactCheckboxRegulationInput.checked){
            formContactCheckboxRegulationInput.classList.remove("is-success");
            formContactCheckboxRegulationInput.classList.add("is-danger");
            formContactCheckboxRegulationHelp.classList.remove("is-success");
            formContactCheckboxRegulationHelp.classList.add("is-danger");
            formContactCheckboxRegulationHelp.textContent = `wymagane jest zaakceptowanie regulaminu serwisu`
            isRegulationIsAccepted = false;
        }
        else{
            formContactCheckboxRegulationInput.classList.remove("is-danger");
            formContactCheckboxRegulationInput.classList.add("is-success");
            formContactCheckboxRegulationHelp.classList.remove("is-danger");
            formContactCheckboxRegulationHelp.classList.add("is-success");
            formContactCheckboxRegulationHelp.textContent = ``
            isRegulationIsAccepted = true;
    }
    resetFormContact();
}

const onContactFormPrivacy = event => {
    if(!formContactCheckboxPrivacyInput.checked){
        formContactCheckboxPrivacyInput.classList.remove("is-success");
        formContactCheckboxPrivacyInput.classList.add("is-danger");
        formContactCheckboxPrivacyHelp.classList.remove("is-success");
        formContactCheckboxPrivacyHelp.classList.add("is-danger");
        formContactCheckboxPrivacyHelp.textContent = `wymagane jest zaakceptowanie polityki prywatności`
        isPrivacyIsAccepted = false;
    }
    else{
        formContactCheckboxPrivacyInput.classList.remove("is-danger");
        formContactCheckboxPrivacyInput.classList.add("is-success");
        formContactCheckboxPrivacyHelp.classList.remove("is-danger");
        formContactCheckboxPrivacyHelp.classList.add("is-success");
        formContactCheckboxPrivacyHelp.textContent = ``
        isPrivacyIsAccepted = true;
    }
    resetFormContact();
}


onContactFormUserName();
onContactFormUserEmail();
onContactFormMessageTopic();
onContactFormUserMessage();
onContactFormRegulation();
onContactFormPrivacy();


formContactUserNameInput.addEventListener("input", onContactFormUserName);
formContactUserEmailInput.addEventListener("input", onContactFormUserEmail);
formContactMessageTopicInput.addEventListener("input", onContactFormMessageTopic);
formContactUserMessageInput.addEventListener("input", onContactFormUserMessage);
formContactCheckboxRegulationInput.addEventListener("input", onContactFormRegulation);
formContactCheckboxPrivacyInput.addEventListener("input", onContactFormPrivacy);