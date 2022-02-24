// copied from https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait: number, immediate: boolean = false) {
  let timeout;

  const debouncedFunction = (...args) => {
    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };

  return debouncedFunction;
}

export default debounce;
