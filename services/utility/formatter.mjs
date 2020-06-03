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

export function flattenArray(rawArr = [], property = null) {
  if (!property) {
    return rawArr.reduce(
      (acc, arr) => acc.concat(Array.isArray(arr) ? flattenArray(arr) : arr),
      [],
    );
  }

  return rawArr.reduce(
    (acc, arr) => {
      acc.push(arr);
      return acc.concat(Array.isArray(arr[property]) ? flattenArray(arr[property], property) : []);
    },
    [],
  );
}

export function flattenCategories(categoryTree = []) {
  // eslint-disable-next-line no-underscore-dangle
  return categoryTree.map((x) => x._doc)
    .reduce(
      (acc, cur) => {
        acc.push(cur);
        return acc.concat(flattenArray(cur.Children, 'Children'));
      },
      [],
    );
}
