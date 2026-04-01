import './style.css'
import gsap from 'gsap'

const tl = gsap.timeline()
tl.from('h1', {
    y: 20,
    opacity: 0,
    filter: 'blur(4px)', 
    duration: 1.3, 
    ease: 'expo.out'
})

tl.from('main div',{
    y: 20,
    opacity: 0,
    duration: 1.6,
    ease: 'elastic.out',
    stagger: 0.4,
    rotate: 14,
    delay: 1
}, '-=0.6')

tl.from('.sec1', {
    y: 40,
    opacity: 0,
    duration: 2.2,
    scale: 0.5,
    filter: 'blur(5px)',
    ease: 'expo.out'
}, '-=0.4') 

tl.from('.sec2', {
    y: 40,
    opacity: 0,
    duration: 1.4,
    ease: 'power2.out',
}, '-=0.5')

tl.from('.sec3',{
    y: 200,
    opacity: 0,
    duration: 2
},'-=0.2')

tl.from('.sec4', {
    y: 40,
    opacity: 0,
    duration: 2.2,
    scale: 0.5,
    filter: 'blur(5px)',
    ease: 'expo.out'
},'-=0.3')

tl.from('.sec5', {
    y: 40,
    opacity: 0,
    duration: 2,
    scale: 0.8,
    filter: 'blur(2px)',
    ease: 'expo.out'
},'-=0.2')
