// copied from https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate = false) {
  let timeout;

  const debouncedFunction = () => {
    const args = arguments;

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
