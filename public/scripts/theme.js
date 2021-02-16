/* Dark mode */
/* Fonte: 
    https://www.youtube.com/watch?v=BvhYm0BOLvA&feature=youtu.be&ab_channel=Rocketseat 
   Autor:
    Mayk Brito
*/
const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) => 
    window
        .getComputedStyle(element)
        .getPropertyValue(style)

const initialColors = {
    bgColor:getStyle(html, "--bg-color"),
    bgHeader:getStyle(html, "--bg-header"),
    darkBlue:getStyle(html, "--dark-blue"),
    green:getStyle(html, "--green"),
    lightGreen:getStyle(html, "--light-green"),
    incomeColor:getStyle(html, "--income-color"),
    red:getStyle(html, "--red"),
    redDark:getStyle(html, "--red-dark"),
    modalColor:getStyle(html, "--modal-color"),
    white:getStyle(html, "--white"),
    black:getStyle(html, "--black"),
}
const darkMode = {
    bgColor: "#202024",
    bgHeader: "#121214",
    darkBlue: "#208CF9",
    green: "#083904",
    lightGreen: "#3f8127",
    incomeColor: "#31C015",
    red: "#500A0A",
    redDark: "#F50D05",
    white: "#1c1c1c",
    black: "#FFFFFF",
    modalColor: "#202024",
}

const transformKey = key =>
    "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()

const changeColors = (colors) => {
    Object.keys(colors).map(key => 
        html.style.setProperty(transformKey(key), colors[key]), 
    )
}

checkbox.addEventListener("change", ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

/* Guardando no local storage */
/* Fonte: 
    https://gist.github.com/maykbrito/f3744039fcc20db62d6cfd502aa2bc86  
   Autor:
    Maximano Leite
*/
const isExistLocalStorage = (key) => 
    localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
    localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
    JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
if (target.checked) {
  changeColors(darkMode) 
  createOrEditLocalStorage('modo','darkMode')
} else {
  changeColors(initialColors)
  createOrEditLocalStorage('modo','initialColors')
}
})

if(!isExistLocalStorage('modo'))
    createOrEditLocalStorage('modo', 'initialColors')

if (getValeuLocalStorage('modo') === "initialColors") {
    checkbox.removeAttribute('checked')
    changeColors(initialColors);
} else {
    checkbox.setAttribute('checked', "")
    changeColors(darkMode);
}
