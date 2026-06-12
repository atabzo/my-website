gsap.registerPlugin(ScrollTrigger); // ✅ this one stays outside, it's fine

document.addEventListener("DOMContentLoaded", () => {

  // queries
  const title = document.querySelector("h1");
  const hero = document.querySelector(".hero");

  // fonts
  document.fonts.ready.then(() => {
    document.documentElement.style.visibility = 'visible';
  });

  // animations
  gsap.from(".card", {
    opacity: 0,
    y: 60,
    stagger: 0.15,
    scrollTrigger: { trigger: ".cards-section", start: "top 75%" }
  });

  // imagetrail setup
  let flair = gsap.utils.toArray(".flair");
  let gap = 10;
  let index = 0;
  let wrapper = gsap.utils.wrap(0, flair.length);
  gsap.defaults({ duration: 1 });

  let mousePos = { x: 0, y: 0 };
  let lastMousePos = { x: 0, y: 0 };   // ⚠️ fix: was pointing to same object as mousePos
  let cachedMousePos = { x: 0, y: 0 }; // ⚠️ fix: same issue

  window.addEventListener("mousemove", (e) => {
    mousePos = { x: e.x, y: e.y };
  });

  function playAnimation(shape) {
    let tl = gsap.timeline();
    tl.from(shape, { opacity: 0, scale: 0, ease: "elastic.out(1,10)" })
      .to(shape, { rotation: "random([-360, 360])" }, "<")
      .to(shape, { y: "120vh", ease: "back.in(.4)", duration: 1 }, 0);
  }

  function animateImage() {
    let wrappedIndex = wrapper(index);
    let img = flair[wrappedIndex];
    gsap.killTweensOf(img);
    gsap.set(img, { clearProps: "all" });
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

  function ImageTrail() {
    let travelDistance = Math.hypot(
      lastMousePos.x - mousePos.x,
      lastMousePos.y - mousePos.y
    );
    cachedMousePos.x = gsap.utils.interpolate(cachedMousePos.x, mousePos.x, 0.1);
    cachedMousePos.y = gsap.utils.interpolate(cachedMousePos.y, mousePos.y, 0.1);
    if (travelDistance > gap) {
      animateImage();
      lastMousePos = { ...mousePos }; // ⚠️ fix: copy the object, don't reference it
    }
  }

  gsap.ticker.add(ImageTrail);

  // Create the tooltip box once
const box = document.createElement('div');
box.id = 'tooltip-box';
document.body.appendChild(box);

// Grab all your tooltip words
const words = document.querySelectorAll('.bhanu');

words.forEach(word => {
  word.addEventListener('mouseenter', (e) => {
    box.textContent = word.dataset.tip;  // pull from data-tip
    box.style.display = 'block';
  });

  word.addEventListener('mousemove', (e) => {
    box.style.left = e.clientX + 14 + 'px';  // 14px offset from cursor
    box.style.top  = e.clientY + 14 + 'px';
  });

  word.addEventListener('mouseleave', () => {
    box.style.display = 'none';
  });
});

}); // ← everything closes here

