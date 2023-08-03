const btn = document.getElementById('btn')!;

let count = 0;

function render() {
  btn.textContent = `Count: ${count}`;
}

btn.addEventListener('click', () => {
  // ...
});
