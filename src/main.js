import './style.css'
console.log('Het werkt!')
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
    duration: 1.4,
    ease: 'elastic.out',
stagger: 0.4,
rotate: 10
}, '-=0.6')

tl.from('.sec1', {
y: 40,
opacity: 0,
duration: 2.2,
scale: 0.5,
filter: 'blur(5px)',
ease: 'expo.out'
}, '-=0.4') 

tl.to('.sec2', {
opacity: 0.5,
duration: 1.4,
rotate: 0,
ease: 'expo.out',
scale: 1,
}, '-=0.5')



