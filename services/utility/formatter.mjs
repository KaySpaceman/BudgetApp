export default function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

export function objArrToObj(arr, key, value) {
  const fullObj = {};

  arr.forEach((obj) => {
    if (typeof obj[key] === 'undefined' || typeof obj[value] === 'undefined') {
      return;
    }

    fullObj[obj[key]] = obj[value];
  });

  return fullObj;
}
