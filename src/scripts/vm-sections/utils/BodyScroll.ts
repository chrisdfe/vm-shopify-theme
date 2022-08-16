type BodyScrollLockType = 'menu' | 'modal';

class BodyScroll {
  static lock = (type: BodyScrollLockType = 'menu') => {
    const className = `${type}-is-open`;
    document.body.classList.add(className);
  };

  static unlock = (type: BodyScrollLockType = 'menu') => {
    const className = `${type}-is-open`;
    document.body.classList.remove(className);
  };
}

export default BodyScroll;
