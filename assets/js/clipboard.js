const pre = document.getElementsByTagName('pre')

for (var i = 0; i < pre.length; ++i) {
  const element = pre[i]
  const content = element.textContent
  const button = document.createElement('button')
  button.className = 'btn btn-copy'
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(content).then(
      () => {
        console.log('copied')
      },
      () => {
        console.log('copying to clipboard failed')
      }
    )
  })
  element.prepend(button)
}
