document.fonts.ready.then(() => {
  document.documentElement.style.visibility = 'visible'
})

gsap.from("h1, body", { 
  opacity: 0, 
  y: 50, 
  duration: 1, 
  
  ease: "elastic.out(1, 0.5)" 
});

function playAnimation(shape) {
 // the timeline
  let tl = gsap.timeline();
  tl.from(shape,{
    opacity: 0,
    scale: 0,
    ease: "elastic.out(1,10)",
  })
  .to(shape,{
    rotation: "random([-360, 360])",
  }, "<")
  .to(shape,{
    y: "120vh",
    ease: "back.in(.4)",
    duration: 1,
  },0)
  
}

/* --------------------------------

The other stuff...

------------------------------------*/
let flair = gsap.utils.toArray(".flair");
let gap = 100; // if you're nosy though, this number spaces the 'lil shapes out
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({duration: 1})

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;

window.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.x,
    y: e.y
  };
});

gsap.ticker.add(ImageTrail);

function ImageTrail() {
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  // keep the previous mouse position for animation
  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = mousePos;
  }
}

function animateImage() {
  let wrappedIndex = wrapper(index);

  console.log(index, flair.length);

  let img = flair[wrappedIndex];
  gsap.killTweensOf(img);
  
  gsap.set(img, {
    clearProps: "all",
  });
  

  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);

  index++;
}
