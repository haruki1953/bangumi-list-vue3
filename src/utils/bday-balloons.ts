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

    setTimeout(() => {
      releaseBalloon(element)
    }, i * 200)
  }

  function randomColor() {
    return colors[random(0, colors.length)]
  }

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function releaseBalloon(balloon: HTMLDivElement) {
    // 持续时间
    const duration = random(5000, 8000)
    // 延迟
    const delay = random(100, 1000)
    // 位置（left或right）最小为5可以尽量居中
    const location = random(5, 50)
    // 随机左右偏移
    let translateX = -120
    let translateY = -120
    const translateRandom = -120 * Math.random() * 0.2
    if (random(0, 2) === 0) {
      translateX = translateX + translateRandom
      translateY = translateY - translateRandom
    } else {
      translateX = translateX - translateRandom
      translateY = translateY + translateRandom
    }

    // 随机左侧和右侧
    if (random(0, 2) === 0) {
      balloon.style.right = `${location}vw`
    } else {
      balloon.style.left = `${location}vw`
    }

    const sequence = [
      // 初始状态
      {
        offset: 0,
        transform: `rotateZ(45deg) translate(0, 0)`,
        easing: 'ease'
      },
      // 最终状态
      {
        offset: 1,
        transform: `rotateZ(45deg) translate(${translateX}vh, ${translateY}vh)`,
        easing: 'ease'
      }
    ]

    const balloonAnimation = balloon.animate(sequence, {
      duration,
      delay
    })

    balloonAnimation.onfinish = () => balloon.remove()
  }
}
