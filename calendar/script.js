const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer  = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"), 
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//funçção para adicionar dias

function initCalendar(){
    //function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() -1;

    date.innerHTML = months[month] + " " + year;

    //adicionar dias

    let days = "";

    //dias do mês passado

    for(let x = day; x > 0; x--){
        days += `<div class= "day prev-date" >${prevDays - x +1}</div>`;
        
    }

    //quantidade de dias do mês atual

    for(let i = 1; i<=lastDate; i++){
        console.log("aaa");
        //se o dia é hoje adicione a classe today
        if(i === new Date().getDate() 
        && year === new Date().getFullYear() 
        && month === new Date().getMonth()){
            days += `<div class="day today">${i}</div>`;
            console.log("aab");
        }

        //adiciona o resto dos dias
        else{
            console.log("aac");
            days += `<div class="day">${i}</div>`;
        }
    }

    //dias do próximo mês
    for(let j = 1; j<=nextDays; j++){
        days += `<div class="day next-date" >${j}</div>`;
    }

    daysContainer.innerHTML = days;
}

initCalendar();

//mês passado
function prevMonth(){
    month--;
    if(month<0){
        month = 11;
        year--;
    }
    initCalendar();
}

//próximo mês
function nextMonth(){
    month++;
    if(month>11){
        month = 0;
        year++;
    }
    initCalendar();
}

//roda a função quando houver o click

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// calendária está pronto
//adicionar 'vá para data especificada' e 'vá para hoje'

todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar()
});

dateInput.addEventListener("input", (e) => {
    //permite somente números e remove o resto
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if(dateInput.value.length === 2){
        //adiciona a '/' depois de dois números digitados
        dateInput.value += '/';
    
    }
    if(dateInput.value.length > 7){
        //não permite mais de 7 caracteres
        dateInput.value = dateInput.value.slice(0, 7);
    }
    
    //se o backspace for pressionado
    if(e.inputType === "deleteContentBackward"){
        if(dateInput.value.length === 3){
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

//ir para a data digitada
function gotoDate(){
    const dateArr = dateInput.value.split("/");

    //validação da data
    if(dateArr.length === 2){
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4){
            month == dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }

    //se a data for inválida
    alert("invalid date");
}

const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle= document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    //se clicar fora (da caixa) fechar ela
    if(e.target !== addEventBtn && !addEventContainer.contains(e.target)){
        addEventContainer.classList.remove("active");
    }
});
