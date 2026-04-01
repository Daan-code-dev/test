import './style.css'
import gsap from 'gsap'

const tl = gsap.timeline()
tl.from('h1', {
    y: 20,
    opacity: 0,
    filter: 'blur(4px)', 
    duration: 0.8, 
    ease: 'expo.out'
})

tl.from('main div',{
    y: 20,
    opacity: 0,
    duration: 1,
    ease: 'elastic.out',
    stagger: 0.3,
    rotate: 14,
    delay: 1
}, '-=0.4')

tl.from('.sec1', {
    y: 40,
    opacity: 0,
    duration: 1.7,
    scale: 0.5,
    filter: 'blur(5px)',
    ease: 'expo.out'
}, '-=0.5') 

tl.from('.sec2', {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
}, '-=0.5')

tl.from('.sec3',{
    y: 200,
    opacity: 0,
    duration: 1.4
},'-=0.5')

tl.from('.sec4', {
    y: 40,
    opacity: 0,
    duration: 1.7,
    scale: 0.5,
    filter: 'blur(5px)',
    ease: 'expo.out'
},'-=0.5')

tl.from('.sec5', {
    y: 40,
    opacity: 0,
    duration: 1.4,
    scale: 0.8,
    filter: 'blur(2px)',
    ease: 'expo.out'
},'-=0.5')

tl.from('.guitar-section', {
    y: 20,
    opacity: 0,
    filter: 'blur(5px)',
    duration: 2,
    ease: 'expo.out'
}, '-=0.5')

tl.from('.form-section', {
   y: 0,
   opacity: 0, 
   duration: 0.8,
   scale: 0.7,
   ease: 'expo.out'
}, '-=0.2')

tl.from('.footer', {
    y: 30,
    opacity: 0,
    duration: 1.4,
    ease: 'expo.out'
}, '-=0.2')

// Guitar Sound Functionality
const stringFrequencies = {
    1: 329.63,  // E4
    2: 246.94,  // B3
    3: 196.00,  // G3
    4: 146.83,  // D3
    5: 110.00,  // A2
    6: 82.41    // E2
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
        
        const tl = gsap.timeline()
        
        // Start with larger vibration, gradually decreasing
        tl.to(stringElement, {
            x: -4,
            duration: 0.08,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: 4,
            duration: 0.12,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: -3,
            duration: 0.1,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: 3,
            duration: 0.1,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: -2,
            duration: 0.12,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: 2,
            duration: 0.15,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: -1,
            duration: 0.15,
            ease: 'expo.out'
        })
        .to(stringElement, {
            x: 1,
            duration: 0.2,
            ease: 'expo.out'
        })
        .to(stringElement, {
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
        
        // Store original colors
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

// Add click listeners to strings
document.querySelectorAll('.string').forEach(string => {
    string.addEventListener('click', () => {
        const stringNumber = string.getAttribute('data-string')
        playString(stringNumber)
    })
})

// Add click listeners to note labels
document.querySelectorAll('.note-label').forEach(label => {
    label.addEventListener('click', () => {
        const stringNumber = label.getAttribute('data-string')
        playString(stringNumber)
    })
})

// Add click listeners to tuning pegs
document.querySelectorAll('.tuning-peg').forEach(peg => {
    peg.addEventListener('click', () => {
        const pegNumber = peg.getAttribute('data-peg')
        animatePeg(pegNumber)
        
        // Play a tuning sound
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

// Distortion slider
const distortionSlider = document.getElementById('distortion')
const distortionValue = document.querySelector('.effect-value')

if (distortionSlider) {
    distortionSlider.addEventListener('input', (e) => {
        distortionAmount = parseInt(e.target.value)
        distortionValue.textContent = `${distortionAmount}%`
    })
}

// Volume slider
const volumeSlider = document.getElementById('volume')
const volumeValue = document.querySelectorAll('.effect-value')[1]

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        masterVolume = parseInt(e.target.value) / 100
        volumeValue.textContent = `${e.target.value}%`
    })
}
