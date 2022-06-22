class BodyScroll {
  static lock = () => {
    document.body.classList.add("menu-is-open");
  };

  static unlock = () => {
    document.body.classList.remove("menu-is-open");
  };
}

export default BodyScroll;
