class Dog {
  constructor(name = "Fido", color = "blue") {
    this.name = name;
    this.color = color;
  };
}

let dog1 = new Dog;  // Create a new object
console.log(dog1);

// IGNORE ABOVE

// Switch screens
document.querySelector("#div1").style.display = "block";

document.querySelectorAll("a").forEach(item => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    let screen = event.target.getAttribute("data-screen");
    console.log(screen);

    document.querySelectorAll("div.screen").forEach(screen => screen.style.display = "none")

    document.querySelector("#" + screen).style.display = "block";
  })
})


// Textfield
const textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));

// List
const list = new mdc.list.MDCList(document.querySelector('.mdc-list'));

