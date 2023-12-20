/** sound.js */
const changeSound = new Audio('./src/sound/change.mp3')
const dropSound = new Audio('./src/sound/drop.mp3')
const breakSound = new Audio('./src/sound/break.mp3')

export function playChange() {
  playSound(changeSound)
}
export function playDrop() {
  playSound(dropSound)
}
export function playBreak() {
  playSound(breakSound)
}

function playSound(sound) {
  sound.currentTime = 0
  sound.play()
}
function stopSound(sound) {
  sound.pause()
}