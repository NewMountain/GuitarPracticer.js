// So music is a little crazy, there are 12 chromatic notes, 
// but can be described in a number of overlapping ways
// Let's see if we can bring some order to the madness.

// Create an audio context
// There is likely a library for this, but I kind of wanted to see how
// sound in JS worked, so this is mostly just exploring a new API
// and likely not "great code"
// Create an audio context
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// Create a way to make volume
let gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination)

// We are making a list of 24 notes, this will make sense later
// when we are making chords
const notes = R.range(0,24)

// Initiate a chord of oscilators with no pitch
let chord = { first: audioCtx.createOscillator(), 
              third: audioCtx.createOscillator(), 
              fifth: audioCtx.createOscillator(), 
              seventh: audioCtx.createOscillator()};

// Sine waves are pretty cool
chord.first.type = 'sine';
chord.third.type = 'sine';
chord.fifth.type = 'sine';
chord.seventh.type = 'sine';



// GIVE THIS CHORD AN AMP!
chord.first.connect(gainNode);
chord.third.connect(gainNode);
chord.fifth.connect(gainNode);
chord.seventh.connect(gainNode);


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

// More definitions -- Music is weird
const noteToNotation = {
  0: ["A"],
  1: ["A#", "Bb"],
  2: ["B"],
  3: ["C"],
  4: ["C#", "Db"], 
  5: ["D"],
  6: ["D#", "Eb"], 	
  7: ["E"],
  8: ["F"],
  9: ["F#", "Gb"], 	
  10: ["G"],
  11: ["G#", "Ab"],
  12: ["A"],
  13: ["A#", "Bb"],
  14: ["B"],
  15: ["C"],
  16: ["C#", "Db"],
  17: ["D"],
  18: ["D#", "Eb"],
  19: ["E"],
  20: ["F"],
  21: ["F#", "Gb"],
  22: ["G"],
  23: ["G#", "Ab"],
};

// Nice little helper function 
const randomIntBetween = (to) => Math.floor(Math.random() * to);

// A little wonky, just selecting a randomish number from the length of the list
// the plucking out the element at that random index
const pickOne = (stuff) => {
  return stuff[randomIntBetween(R.length(stuff))]
}

const translateNoteToWritten = (note) => {
  let possibleWrittenNotes = noteToNotation[note];
  return (R.length(possibleWrittenNotes) > 1 ? R.head(possibleWrittenNotes) : pickOne(possibleWrittenNotes));
}

// Picking a human note from the list
const pickRandomRoot = () => {
  // We should only pick a root note from the first octave
  // This way, we can always build a chord using notes from the next octave up and never
  // "run out of notes" (from our object above) as we ascend the scale.
  let note = randomIntBetween(12);
  return { note: note, 
           writtenNote: translateNoteToWritten(note),
           frequency: noteToFreq[note]
          }
}

let clearMusicArea = () => {
  let elem = document.getElementById("musicArea");
  // Terrifying how mixed the internet is on whether this 
  // is a bad way to clear all DOM child elements
  elem.innerHTML = '';
}

const playThatNote = (newRoot) => {
  // set to sine wave
  chord.first.type = 'sine';
  chord.first.frequency.value = newRoot.frequency;
  // Make glorious music!!!! Sort of....
  // Stop the oscilator in case it's working
  try {
    chord.first.start();
  } catch(err) {
    console.log('Im tired and I just wanted to practice guitar...');
  }
}

const makeNewMusicArea = (newRoot) => {
  // Grab the music area
  let elem = document.getElementById("musicArea");

  // Generate a random number for the reference fret
  let newFret = randomIntBetween(13);

  // The dream of the 90s is alive in Portland....and this codebase.
  let firstP = document.createElement("p");
  let newTask = `Please play the closest: ${newRoot.writtenNote} at or above the ${newFret} fret.`
  let textNode = document.createTextNode(newTask);
  firstP.appendChild(textNode);
  elem.appendChild(firstP);

  playThatNote(newRoot);
}

const updateDomAndMusic = (newRoot) => {
  // Step 1 - Clear DOM
  clearMusicArea();
  // Step 2 - Put in a new DOM
  makeNewMusicArea(newRoot);
}

// I know I am using chord as global state and that's likely not cool. 
// I'm an Elm dev at heart just treating it as the Model, but I know this is
// JS and chord is no model. No arrows please.
let newExercise = () => {
  let newRoot = pickRandomRoot();
  updateDomAndMusic(newRoot);
}

let silencio = () => {
  let elem = document.getElementById('mute');
  console.log('In silencio');
  console.log(elem);
  if(elem.class == "") {
    gainNode.connect(audioCtx.destination);
    elem.class = "activated";
    elem.innerHTML = "Click here to mute!";
  } else {
    gainNode.disconnect(audioCtx.destination);
    elem.class = "";    
    elem.innerHTML = "Click here to unmute!";
  }
}

// Click handlers and junk
let newNote = document.getElementById("newNote");
newNote.addEventListener("click", newExercise, false);

let muteButton = document.getElementById('mute');
muteButton.addEventListener("click", silencio, false);


let init = () => {
  console.log('Welcome to GuitarPracticer!');
}

init();
