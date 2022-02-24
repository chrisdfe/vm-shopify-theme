class BodyScroll {
  lock = () => {
    document.body.classList.add("menu-is-open");
  };

  unlock = () => {
    document.body.classList.remove("menu-is-open");
  };
}

export default BodyScroll;
