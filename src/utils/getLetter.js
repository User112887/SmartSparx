const getLetter = number => {
  let letter;

  switch (number) {
    case 0:
      letter = 'A.';
      break;
    case 1:
      letter = 'B.';
      break;
    case 2:
      letter = 'C.';
      break;
    case 3:
      letter = 'D.';
      break;
    default:
      letter = null;
      break;
  }

  return letter;
};

const handleKeyPress = event => {
  const key = event.key.toLowerCase();

  const keyMap = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3
  };

  if (key in keyMap) {
    const number = keyMap[key];
    const letter = getLetter(number);
    console.log(letter); 
    selectOption(number); 
  }
};

const selectOption = number => {
  //  console.log(`Option ${number} selected`);
};

document.addEventListener('keypress', handleKeyPress);

export default getLetter;
