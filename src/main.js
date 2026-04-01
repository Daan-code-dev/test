import './style.css'
import gsap from 'gsap'

gsap.set('h1, main div, .sec1, .sec2, .sec3, .sec4, .sec5, .sec6, .guitar-section, .form-section, .footer', {
    opacity: 0,
    y: 35
})

gsap.set('.sec1, .sec2, .sec3, .sec4, .sec5, .sec6', { scale: 0.5 })
gsap.set('.form-section', { scale: 0.8 })

const tl = gsap.timeline()

tl.to('h1', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' })
tl.to('main div', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' }, '+=0.2')
tl.to('.sec1, .sec2, .sec3, .sec4, .sec5, .sec6', { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }, '+=0.2')
tl.to('.guitar-section', { opacity: 1, y: 0, duration: 1.8, ease: 'power2.out' }, '+=0.2')
tl.to('.form-section', { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, '+=0.2')
tl.to('.footer', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.2')

const stringFrequencies = {
    1: 329.63,
    2: 246.94,
    3: 196.00,
    4: 146.83,
    5: 110.00,
    6: 82.41
}

let audioContext = null
let distortionAmount = 0
let masterVolume = 0.5

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContext
}

function makeDistortionCurve(amount) {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = ((3 + amount * 100) * x * 20 * deg) / (Math.PI + amount * 100 * Math.abs(x))
    }
    return curve
}

function playString(stringNumber) {
    const ctx = initAudio()
    if (ctx.state === 'suspended') {
        ctx.resume()
    }
    
    const frequency = stringFrequencies[stringNumber]
    if (!frequency) return
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.type = distortionAmount > 10 ? 'sawtooth' : 'triangle'
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    if (distortionAmount > 0) {
        const distortion = ctx.createWaveShaper()
        distortion.curve = makeDistortionCurve(distortionAmount / 100)
        distortion.oversample = '4x'
        
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2000 + (distortionAmount * 20), ctx.currentTime)
        
        gainNode.gain.setValueAtTime(masterVolume, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)
        
        oscillator.connect(filter)
        filter.connect(distortion)
        distortion.connect(gainNode)
        gainNode.connect(ctx.destination)
    } else {
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2000, ctx.currentTime)
        filter.Q.setValueAtTime(1, ctx.currentTime)
        
        gainNode.gain.setValueAtTime(masterVolume, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2)
        
        oscillator.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
    }
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 2)
    
    animateString(stringNumber)
}

function animateString(stringNumber) {
    const stringElement = document.querySelector(`.string-${stringNumber}`)
    const noteLabel = document.querySelector(`.note-label[data-string="${stringNumber}"]`)
    
    if (noteLabel) {
        noteLabel.classList.add('active')
        gsap.to(noteLabel, {
            scale: 1.15,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'power2.inOut',
            onComplete: () => {
                noteLabel.classList.remove('active')
                gsap.set(noteLabel, { scale: 1 })
            }
        })
    }
    
    if (stringElement) {
        gsap.to(stringElement, {
            attr: { stroke: '#ffd700' },
            strokeWidth: 3.5,
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))',
            duration: 0.05
        })
        
        const stringTl = gsap.timeline()
        
        stringTl.to(stringElement, { x: -4, duration: 0.08, ease: 'expo.out' })
        stringTl.to(stringElement, { x: 4, duration: 0.12, ease: 'expo.out' })
        stringTl.to(stringElement, { x: -3, duration: 0.1, ease: 'expo.out' })
        stringTl.to(stringElement, { x: 3, duration: 0.1, ease: 'expo.out' })
        stringTl.to(stringElement, { x: -2, duration: 0.12, ease: 'expo.out' })
        stringTl.to(stringElement, { x: 2, duration: 0.15, ease: 'expo.out' })
        stringTl.to(stringElement, { x: -1, duration: 0.15, ease: 'expo.out' })
        stringTl.to(stringElement, { x: 1, duration: 0.2, ease: 'expo.out' })
        stringTl.to(stringElement, {
            x: 0,
            duration: 0.25,
            ease: 'expo.out',
            onComplete: () => {
                gsap.to(stringElement, {
                    attr: { stroke: stringElement.dataset.originalColor || '#e8e8e8' },
                    strokeWidth: parseFloat(stringElement.dataset.originalWidth) || 1,
                    filter: 'none',
                    duration: 0.3,
                    ease: 'power2.out'
                })
            }
        })
        
        stringElement.dataset.originalColor = stringElement.getAttribute('stroke')
        stringElement.dataset.originalWidth = stringElement.getAttribute('stroke-width')
    }
}

function animatePeg(pegNumber) {
    const peg = document.querySelector(`.tuning-peg.peg-${pegNumber}`)
    if (peg) {
        peg.classList.add('playing')
        setTimeout(() => {
            peg.classList.remove('playing')
        }, 300)
    }
}

document.querySelectorAll('.string').forEach(string => {
    string.addEventListener('click', () => {
        const stringNumber = string.getAttribute('data-string')
        playString(stringNumber)
    })
})

document.querySelectorAll('.note-label').forEach(label => {
    label.addEventListener('click', () => {
        const stringNumber = label.getAttribute('data-string')
        playString(stringNumber)
    })
})

document.querySelectorAll('.tuning-peg').forEach(peg => {
    peg.addEventListener('click', () => {
        const pegNumber = peg.getAttribute('data-peg')
        animatePeg(pegNumber)
        
        const ctx = initAudio()
        if (ctx.state === 'suspended') {
            ctx.resume()
        }
        
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1)
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
    })
})

const distortionSlider = document.getElementById('distortion')
const distortionValue = document.querySelector('.effect-value')

if (distortionSlider) {
    distortionSlider.addEventListener('input', (e) => {
        distortionAmount = parseInt(e.target.value)
        distortionValue.textContent = `${distortionAmount}%`
    })
}

const volumeSlider = document.getElementById('volume')
const volumeValue = document.querySelectorAll('.effect-value')[1]

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        masterVolume = parseInt(e.target.value) / 100
        volumeValue.textContent = `${e.target.value}%`
    })
}

const keyMap = {
    's': '1',
    'd': '2',
    'f': '3',
    'g': '4',
    'h': '5',
    'j': '6'
}

document.addEventListener('keydown', (e) => {
    const stringNumber = keyMap[e.key.toLowerCase()]
    if (stringNumber && !e.repeat) {
        playString(stringNumber)
    }
})
