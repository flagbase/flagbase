export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function strToImagePath(str: string) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.png';
}
