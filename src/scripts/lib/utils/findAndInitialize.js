export default function findAndInitialize(klass) {
  const element = document.querySelector(klass.selector);

  if (element) {
    const klassInstance = new klass(element);
    klassInstance.initialize();
    return klassInstance;
  }

  return null;
}
