export async function loadJson(url) {
  return new Promise((resolve, reject) => {
    try {
      fetch(url)
        .then((response) => response.json())
        .then((json) => resolve(json));
    } catch (e) {
      reject();
    }
  });
}
