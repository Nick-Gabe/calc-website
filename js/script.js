const doc = {
    theme: Number(window.localStorage.getItem('theme')) || 1,
    bg: document.body,
    keypadBg: document.getElementById('keypad'),
    screen: document.getElementById('screen'),
    themeChanger: document.getElementById('themeChanger'),
    themeChangerBtn: document.querySelector('#themeChanger > button'),
    allButtons: document.querySelectorAll('#keypad > button'),
    colorTypes: [
        {
            colorNum: 1,
            elems: document.getElementsByClassName('type1'), // header and screen color
        },
        {
            colorNum: 2,
            elems: document.getElementsByClassName('type2'), // button number colors
        },
        {
            colorNum: 3,
            elems: document.getElementsByClassName('type3'), // button text colors
        },
        {
            colorNum: 4,
            elems: document.getElementsByClassName('type4') // button submit color
        },
    ],
    currentPalette: null
}

function setCalculator() {

    window.onkeydown = (e) => {
        pressButton(e.key, 'press')
    }

    window.onkeyup = (e) => {
        pressButton(e.key, 'drop')
    }

    doc.allButtons.forEach(element => {

        element.onpointerdown = (e, id = element.id) => {
            pressButton(id, 'press')
        }
    })

    window.onpointerup = (e, id = '0') => {
        pressButton(id, 'dropAll')
    }

    document.querySelectorAll('[data-changeTheme]')
        .forEach(element => {
            element.onclick = () => {
                doc.theme + 1 > 3 ?
                    doc.theme = 1 :
                    doc.theme++

                window.localStorage.setItem('theme', doc.theme)

                changeTheme(doc.theme)
            }
        })
    changeTheme(doc.theme)
}
setCalculator()

function changeTheme(themeNumber = 1) {
    const sliderPositions = ['3px', '21px', '42px']
    doc.themeChangerBtn.style.transform = `translateX(${sliderPositions[themeNumber - 1]})`

    const colorPalette = [
        {
            bg: 'hsl(222, 26%, 31%)',
            keypadBg: '#232c43',
            screenBg: 'hsl(224, 36%, 15%)',

            ['1color']: 'hsl(30, 25%, 89%)',

            ['2color']: 'hsl(223, 31%, 20%)',
            ['2bg']: 'hsl(30, 25%, 89%)',
            ['2shadow']: 'hsl(28, 16%, 65%)',

            ['3color']: 'hsl(30, 25%, 89%)',
            ['3bg']: 'hsl(225, 21%, 49%)',
            ['3shadow']: 'hsl(224, 28%, 35%)',

            ['4color']: 'hsl(30, 25%, 89%)',
            ['4bg']: 'hsl(6, 63%, 50%)',
            ['4shadow']: 'hsl(6, 70%, 34%)',
        },
        {
            bg: 'hsl(0, 0%, 90%)',
            keypadBg: '#d1cccc',
            screenBg: 'hsl(0, 0%, 93%)',

            ['1color']: '#000',

            ['2color']: 'hsl(60, 10%, 19%)',
            ['2bg']: 'hsl(45, 7%, 89%)',
            ['2shadow']: 'hsl(35, 11%, 61%)',

            ['3color']: 'hsl(0, 0%, 93%)',
            ['3bg']: 'hsl(185, 42%, 37%)',
            ['3shadow']: 'hsl(185, 58%, 25%)',

            ['4color']: 'hsl(0, 0%, 93%)',
            ['4bg']: 'hsl(25, 98%, 40%)',
            ['4shadow']: 'hsl(25, 99%, 27%)',
        },
        {
            bg: 'hsl(268, 75%, 9%)',
            keypadBg: '#1d0934',
            screenBg: 'hsl(268, 71%, 12%)',

            ['1color']: 'hsl(52, 100%, 62%)',

            ['2color']: 'hsl(52, 100%, 62%)',
            ['2bg']: 'hsl(268, 47%, 21%)',
            ['2shadow']: 'hsl(290, 70%, 36%)',

            ['3color']: 'hsl(0,100%,100%)',
            ['3bg']: 'hsl(281, 89%, 26%)',
            ['3shadow']: 'hsl(285, 91%, 52%)',

            ['4color']: 'hsl(198, 20%, 13%)',
            ['4bg']: 'hsl(176, 100%, 44%)',
            ['4shadow']: 'hsl(177, 92%, 70%)',
        },
    ]

    let colors = colorPalette[themeNumber - 1]
    doc.currentPalette = colors

    for (const type of doc.colorTypes) {
        for (let element of type.elems) {

            element.style.color = colors[`${type.colorNum}color`]

            if (element.tagName === 'BUTTON') {
                element.style.backgroundColor = colors[`${type.colorNum}bg`]
                element.style.boxShadow = `0 3px 0 0 ${colors[`${type.colorNum}shadow`]}`
            };
        };
    };

    doc.bg.style.backgroundColor = colors.bg;
    doc.keypadBg.style.backgroundColor = colors.keypadBg;
    doc.screen.style.backgroundColor = colors.screenBg;
    doc.themeChanger.style.backgroundColor = colors.keypadBg;
    doc.themeChangerBtn.style.backgroundColor = colors['4bg'];
    document.querySelector('meta[name="theme-color"]').setAttribute("content", colors.keypadBg);
}

function pressButton(button, action) {
    function animate(btn, action = "press" || "drop") {
        let button = document.getElementById(btn.replace(',', '.'))
        console.log('🙎‍♂️', action, button)

        if (action === 'press') {
            button.style.boxShadow = `${button.style.boxShadow.slice(0, -11)} 1px 0px 0px`
            button.style.top = '2px'
        } else if (action === 'dropAll') {
            doc.allButtons.forEach(element => {
                element.style.boxShadow = `${element.style.boxShadow.slice(0, -11)} 3px 0px 0px`
                element.style.top = '0px'
            })
        } else {
            button.style.boxShadow = `${button.style.boxShadow.slice(0, -11)} 3px 0px 0px`
            button.style.top = '0px'
        }
    }

    let text = doc.screen.textContent.replace(/,/g,'.')
    const keyVerifier = {
        number(x) {
            let regex = /\+|\-|\*|\//
            if (
                text.substring(0, 15).length >= 15 && !text.match(regex) ||
                text.substring(text.search(regex), 31).length >= 15
            ) return

            if (text === '0' && !x.match(/\.|,/) || text.match(/Infinity|NaN/)) {
                doc.screen.textContent = x
            } else {
                if (x.match(/\.|,/) && text.includes(',')) return
                doc.screen.textContent += x.replace('.', ',')
            }
            changeFontSize(doc.screen.textContent)

        },
        operation(x) {
            if (text === '0' && x === '-') {
                doc.screen.textContent = x
            } else if (text.match(/(\+|\-|\*|\/)./g)) {
                let calc = Function(`return ${text}`)()
                doc.screen.textContent = calc.toString().replace('.',',') + x

                changeFontSize(doc.screen.textContent)
            } else {
                if (text.match(/(\+|\-|\*|\/)$/)) return
                doc.screen.textContent += x
            }
        },
        return() {
            if (text.length === 1) {
                text != 0 ?
                    doc.screen.textContent = 0 :
                    false // return 
            }
            else {
                doc.screen.textContent = text.substring(0, text.length - 1)
                changeFontSize(doc.screen.textContent)
            }
        },
        enter() {
            if (text.match(/(\+|\-|\*|\/)./g)) {
                let calc = Function(`return ${text}`)()
                doc.screen.textContent = calc.toString().replace('.',',')

                changeFontSize(doc.screen.textContent)
            } else return
        },
        clear() {
            doc.screen.textContent = '0'
            changeFontSize(doc.screen.textContent)
        }
    }

    if (button.match(/^[0-9]|\.|,/)) {
        action === 'press' && keyVerifier.number(button)
        animate(button, action)
    }
    else if (button.match(/\+|\-|\*|\//)) {
        action === 'press' && keyVerifier.operation(button)
        animate(button, action)
    }
    else if (button === 'Backspace') {
        action === 'press' && keyVerifier.return()
        animate(button, action)
    }
    else if (button === 'Enter') {
        action === 'press' && keyVerifier.enter()
        animate(button, action)
    }
    else if (button === 'Delete') {
        action === 'press' && keyVerifier.clear()
        animate(button, action)
    }

    function changeFontSize(text) {
        if (text.length > 11) {
            doc.screen.style.fontSize = 320 / text.length + 'px'
        } else {
            doc.screen.style.fontSize = '32px'
        }
    }
}
