// NOTE

// So music is a little crazy, there are 12 chromatic notes, 
// but can be described in a number of overlapping ways
// Let's see if we can bring some order to the madness.

// We are making a list of 24 notes, this will make sense later
// when we are making chords
const notes = R.range(0,24)

// Also, we're going to need two octaves of notes. 
// Source of notes: https://pages.mtu.edu/~suits/notefreqs.html
// Sounds like an object to me
const noteToFreq = {
  0: 220, // A3
  1: 233.08, // A#3/Bb3
  2: 246.94, // B3
  3: 261.63, // C4
  4: 277.18, // C#4/Db4 
  5: 293.66, // D4
  6: 311.13, // D#4/Eb4 	
  7: 329.63, // E4
  8: 349.23, // F4
  9: 369.99, // F#4/Gb4 	
  10: 392.00, // G4
  11: 415.30, // G#4/Ab4
  12: 440.00, // A4
  13: 466.16, // A#4/Bb4
  14: 493.88, // B4
  15: 523.25, // C5
  16: 554.37, // C#5/Db5
  17: 587.33, // D5
  18: 622.25, // D#5/Eb5
  19: 659.25, // E5
  20: 698.46, // F5
  21: 739.99, // F#5/Gb5 
  22: 783.99, // G5
  23: 830.61// G#5/Ab5
};

// Behold, glorious FP!
const freqToNote = R.map(x => parseInt(x), R.invertObj(noteToFreq));

let init = () => {
  console.log(notes);
  console.log(noteToFreq);
  console.log(freqToNote);
}

init()