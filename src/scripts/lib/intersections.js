function registerIntersectionObservers() {
  const observerElements = document.querySelectorAll(
    '[data-on-intersect="appear"]'
  );

  const options = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        if (Array.from(target.classList).includes("intersection-visibility")) {
          target.classList.add("intersection-visibility--visible");
        }

        observer.unobserve(target);
      } else {
        target.classList.add("intersection-visibility");
      }
    });
  }, options);

  observerElements.forEach((element) => {
    observer.observe(element);
  });
}

function init() {
  document.addEventListener("DOMContentLoaded", registerIntersectionObservers);
}

export default {
  init,
};
