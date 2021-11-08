const hamburgerMeniu=() =>{
    const burger= document.querySelector('.burger');
    const nav= document.querySelector('.nav-list');
    const navLinks= document.querySelectorAll('.nav-list li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        navLinks.forEach((link,index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation=`navListFade 0.5 ease forwards ${index/7+0.3}s`
            }
        })
    });

    
}

hamburgerMeniu();

