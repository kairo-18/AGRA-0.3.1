var editor = ace.edit("editor");
editor.setTheme("ace/theme/one_dark");
editor.session.setMode("ace/mode/java");
editor.setShowPrintMargin(false);
editor.setAutoScrollEditorIntoView(true);
editor.resize();
editor.setOptions({
    fontSize: "20px"
});

editor.insert(`public class myClass{
    public static void main(String[] args){
        
    }
}`);

editor.moveCursorTo(2, 8)

var incrementCount = 0;

var insadd = document.getElementById("instruction");
var codeadd = document.getElementById("code");

var instruction = createInputField("text", "Instruction" + incrementCount);
insadd.appendChild(instruction);

var answer = createInputField("text", "Code" + incrementCount);
codeadd.appendChild(answer);

var checkmarks = [];

function createInputField(type, id, isDisabled) {
  var inputField = document.createElement("input");
  inputField.type = type;
  inputField.id = id;
  inputField.disabled = isDisabled || false;
  return inputField;
}

function addFields() {
  if (instruction.value.trim() === '' || answer.value.trim() === '') {
    // Check if either instruction or answer field is empty
    alert("Please fill in both fields before adding new fields.");
    return;
  }

  var temp = {
    instruction: instruction.value,
    answer: answer.value,
    done: false,
    id: incrementCount.valueOf(incrementCount)
  }

  checkmarks.push(temp);

  increment(); // Increment the count

  // Disable the previous textboxes
  instruction.disabled = true;
  answer.disabled = true;

  // Create and append new input fields
  var newInstruction = createInputField("text", "Instruction" + incrementCount, false);
  insadd.appendChild(newInstruction);

  var newAnswer = createInputField("text", "Code" + incrementCount, false);
  codeadd.appendChild(newAnswer);

  // Update global variables for the next iteration
  instruction = newInstruction;
  answer = newAnswer;
}

function increment() {
  incrementCount++;
}

// Calculate scrollbar width
function _calculateScrollbarWidth() {
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
}
window.addEventListener('resize', _calculateScrollbarWidth, false);
document.addEventListener('DOMContentLoaded', _calculateScrollbarWidth, false);
window.addEventListener('load', _calculateScrollbarWidth);

// Calculate column 1
function _calculateCol1Width() {
  var element = document.getElementById('col1Div');
  var positionInfo = element.getBoundingClientRect();
  var width = positionInfo.width;
  document.documentElement.style.setProperty('--col1-width', width + "px");
}
window.addEventListener('resize', _calculateCol1Width, false);
document.addEventListener('DOMContentLoaded', _calculateCol1Width, false);
window.addEventListener('load', _calculateCol1Width);

function submitCheckmarks(){
  
  if(checkmarks != null){

    console.log(checkmarks);
      const req1 = new window.XMLHttpRequest();

      req1.open("POST", "/teacherSubmitForm", true);
      req1.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

      req1.send(JSON.stringify(checkmarks));
      
      setTimeout(backToHome, 1000);
  }


}

function backToHome(){
        window.location.replace("/");
}

function runClick() {

  const req1 = new window.XMLHttpRequest();

  var input = {
      code: editor.getValue(),
      stdin: document.getElementById("stdin").value
  }

  req1.open("POST", "/getinput", true);
  req1.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  req1.send(JSON.stringify(input));



  const req = new XMLHttpRequest();

  req.open('GET', '/output', true);
  req.addEventListener('load', function () {
      var output = req.responseText;
      displayOutput(output);
  });
  req.send();
}

function displayOutput(output) {
  //replace \n with <br>
  output = output.replace(/\n/g, "<br>");
  document.getElementById("output-text").innerHTML = output;
}
