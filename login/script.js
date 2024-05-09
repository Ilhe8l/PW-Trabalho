const sign_in_btn = document.querySelector("#sign-in-btn"),
    sign_up_btn = document.querySelector("#sign-up-btn"),
    container = document.querySelector(".container"),
    sign_in_btn2 = document.querySelector("#sign-in-btn2"),
    sign_up_btn2 = document.querySelector("#sign-up-btn2"),
    goto_inst = document.querySelector("#goto-inst"),
    goto_vol = document.querySelector("#goto-vol"),
    sign_up_form = document.querySelector(".sign-up-form"),
    sign_up_inst = document.querySelector(".sign-up-inst");

sign_up_btn.addEventListener("click", () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () =>{
    container.classList.remove("sign-up-mode");
});

sign_up_btn2.addEventListener("click", () =>{
    container.classList.add("sign-up-mode2");
});

sign_in_btn2.addEventListener("click", () =>{
    container.classList.remove("sign-up-mode2");
});

goto_inst.addEventListener("click", (event) =>{
    event.preventDefault();
    sign_up_form.style.display = 'none';
    sign_up_inst.style.display = 'flex';
});

goto_vol.addEventListener("click", (event) =>{
    event.preventDefault();
    sign_up_form.style.display = 'flex';
    sign_up_inst.style.display = 'none';
});
