// https://github.com/erdoganbavas/web-practices/blob/master/bday-balloons/balloons.js

export const bdayBallons = () => {
  const density = 20 // concurrent balloon count
  const colors = [
    'primary-balloon',
    'success-balloon',
    'info-balloon',
    'warning-balloon',
    'danger-balloon'
  ]

  const stringElement = document.createElement('div')
  stringElement.classList.add('string')

  for (let i = 0; i < density; i++) {
    const element = document.createElement('div')
    element.classList.add('balloon')
    element.classList.add(randomColor())

    element.append(stringElement.cloneNode())
    document.body.append(element)

    setTimeout(
      () => {
        releaseBalloon(element)
      },
      i * 300 + random(0, 600)
    )
  }

  function randomColor() {
    return colors[random(0, colors.length)]
  }

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function releaseBalloon(balloon: HTMLDivElement) {
    const duration = random(5000, 10000)
    const delay = random(100, 1000)
    const x = random(-99, -30) // random x value to fly
    // const x = -100 // random x value to fly
    const y = random(-99, -30) // random y value to fly
    // const y = -100 // random y value to fly

    const sequence = [
      {
        offset: 0,
        transform: `rotateZ(45deg) translate(0, 0)`,
        easing: 'ease-in-out'
      }
    ]

    // random fly direction
    if (random(0, 2) === 0) {
      // first fly up to top left
      balloon.style.left = `${-1 * x}vw`

      sequence.push({
        offset: x / -200,
        transform: `rotateZ(45deg) translate(${x}vh, 0)`,
        easing: 'ease-in-out'
      })
      sequence.push({
        offset: (x + y) / -200,
        transform: `rotateZ(45deg) translate(${x}vh, ${y}vh)`,
        easing: 'ease-in-out'
      })
      sequence.push({
        offset: (-100 + y) / -200,
        transform: `rotateZ(45deg) translate(-100vh, ${y}vh)`,
        easing: 'ease-in-out'
      })
    } else {
      // fist fly up to right top
      sequence.push({
        offset: y / -200,
        transform: `rotateZ(45deg) translate(0, ${y}vh)`,
        easing: 'ease-in-out'
      })
      sequence.push({
        offset: (x + y) / -200,
        transform: `rotateZ(45deg) translate(${x}vh, ${y}vh)`,
        easing: 'ease-in-out'
      })
      sequence.push({
        offset: (-100 + x) / -200,
        transform: `rotateZ(45deg) translate(${x}vh, -100vh)`,
        easing: 'ease-in-out'
      })
    }

    // last move is common
    sequence.push({
      offset: 1,
      transform: `rotateZ(45deg) translate(-100vh, -100vh)`,
      easing: 'ease-in-out'
    })

    const balloonAnimation = balloon.animate(sequence, {
      duration: duration,
      delay: delay
    })

    // Remove the recursive call to stop generating new balloons
    balloonAnimation.onfinish = () => {
      balloon.remove() // Optionally remove the balloon from the DOM after animation
    }
  }
}
