export function readTranslateOffset(element: HTMLElement) {
  const transform = window.getComputedStyle(element).transform;

  if (!transform || transform === 'none') {
    return { x: 0, y: 0 };
  }

  const match = transform.match(/matrix(3d)?\(([^)]+)\)/);
  const values = match?.[2].split(',').map((value) => Number(value.trim()));

  if (!values) {
    return { x: 0, y: 0 };
  }

  return transform.startsWith('matrix3d')
    ? { x: values[12] || 0, y: values[13] || 0 }
    : { x: values[4] || 0, y: values[5] || 0 };
}
