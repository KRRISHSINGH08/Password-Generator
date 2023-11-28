// fetch all elements
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const slider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#Uppercase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
// strings of symbols
const symbols = '!"#$%&()*+,-./:;<=>?@[^]_`{|}~';

// initial state
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

function handleSlider() {
  slider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRandInteger(0, 9);
}

function generateUpperCase() {
  return String.fromCharCode(getRandInteger(97, 123));
}

function generateLowerCase() {
  return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbol() {
  const RandNum = getRandInteger(0, symbols.length);
  return symbols.charAt(RandNum);
}

function calcStrength() {
   let hasUpper = false;
   let hasLower = false;
   let hasNumbers = false;
   let hasSymbols = false;

   if(uppercaseCheck.checked) hasUpper = true;
   if(lowercaseCheck.checked) hasLower = true;
   if(numbersCheck.checked) hasNumbers = true;
   if(symbolsCheck.checked) hasSymbols = true;

    if((hasUpper || hasLower) && hasNumbers && hasSymbols && passwordLength >= 8) {
        setIndicator("0f0"); // strong
    }
    else if((hasUpper || hasLower) && (hasNumbers || hasSymbols) && passwordLength >= 6) {
        setIndicator("ff0"); // medium
    }
    else {
        setIndicator("f00"); // weak
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(e){
        copyMsg.innerText = "Failed!"
    }
    // make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}


slider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener("click", () => {
    if(passwordDisplay.value) 
        copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked)
            checkCount++;
    })

    // Special condition
    if(passwordLength <= checkCount) {
        passwordLength =  checkCount;
        handleSlider();
    }
}

// checkbox on every event listener
// Calculate no of ticked checkbox if any checkbox is ticked
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array) {
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
}

generateBtn.addEventListener("click", () => {
    // none selected
    if(checkCount <= 0)
        return;

    // special condition 
    // if(passwordLength < checkCount) {
    //     passwordLength = checkCount;
    //     handleSlider();
    // }

    console.log("Starting the journey");

    // remove old password
    password = "";

    // put stuff mentioned by checkboxes
/*
    if(uppercaseCheck.checked) 
        password += generateUpperCase();
    if(lowercaseCheck.checked) 
        password += generateLowerCase();
    if(numbersCheck.checked) 
        password += getRandomNumber();
    if(symbolsCheck.checked) 
        password += generateSymbol();

*/

    let funcArr = [];
    
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(getRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory Addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log("Compulsory Addition done");

    // remaining Addtion
    let remLength = passwordLength - funcArr.length;
    for(let i=0; i<remLength; i++){
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    console.log("Remaining Addtion done");

    // shuffle password
    password = shufflePassword(Array.from(password));

    console.log("Shuffling done");

    // show in UI
    passwordDisplay.value = password;
    console.log("UI Additon done");
    // calculate strength
    calcStrength();

});