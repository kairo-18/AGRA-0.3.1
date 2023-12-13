var editor = ace.edit("code-editor");
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

let checkmarks = [];

var checkmark1 = {
    instruction: "Create a variable called 'first' and assign it to 10",
    answer: "int first = 10;",
    done: false,
    id: 1
}

var checkmark2 = {
    instruction: "Create a variable called 'second' and assign it to 20",
    answer: "int second = 20;",
    done: false,
    id: 2
}

var checkmark3 = {
    instruction: "Create an int variable called 'sum' with the value first + second",
    answer: "int sum = first + second;",
    done: false,
    id: 3
}

var checkmark4 = {
    instruction: "Display the sum using println with this text 'first + second = sum",
    answer: `System.out.println(first + " + " + second + " = " + sum);`,
    done: false,
    id: 4
}

function pushCheckmarks(checkmark) {
    checkmarks.push(checkmark);
    monster.health = checkmarks.length * 10;
}

function populateCheckmarks() {
    checkmarks.forEach(checkmark => {
        var checkmarkDiv = document.createElement("div");
        checkmarkDiv.classList.add("instruc-container");
        checkmarkDiv.id = "instruction" + checkmark.id;
        checkmarkDiv.innerHTML = checkmark.instruction;
        checkmarkDiv.style.backgroundColor = "#ff0101";

        var parentDiv = document.getElementById("instructions");
        parentDiv.appendChild(checkmarkDiv);

        parentDiv.style.gridTemplateRows = "30px repeat(" + checkmarks.length + ", 1fr)";
    });
}

function checkCheckmarks() {
    var index = 0;
    checkmarks.forEach(checkmark => {
        if (checkmark.done) {
            document.getElementById("instruction" + (index + 1)).style.backgroundColor = "#0aa605";
        } else {
            document.getElementById("instruction" + (index + 1)).style.backgroundColor = "#ff0101";
        }
        index++;
    });
}


pushCheckmarks(checkmark1);
pushCheckmarks(checkmark2);
pushCheckmarks(checkmark3);
pushCheckmarks(checkmark4);


populateCheckmarks();
console.log(checkmarks);

var code = `public class Main {

  public static void main(String[] args) {
    
    int first = 10;
    int second = 20;

    int sum = first + second;
    System.out.println(first + " + " + second + " = "  + sum);
    
  }
}`;

let keywords = uniq(extractKeywords(code));

//create a function that will extract keywords from the given code
function extractKeywords(code) {
    //split the code into words
    let words = code.split(/\s+|(?<=[^\w\s])|(?=[^\w\s])/g).filter(Boolean);

    return removeNonWords(words);
}

function removeNonWords(arr) {
    const wordPattern = /[\w']+(!)?/g;

    const wordsOnly = arr.join(' ').match(wordPattern) || [];

    return wordsOnly;
}

function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}




function checkCodeByWord() {
    var input = editor.getValue();
    var inputWords = input.split(/[.\s(){}'""\[\]`]+/).filter((word) => word.trim() !== "");


    inputWords.forEach(word => {
        if (keywords.includes(word)) {
            score++;
            updateScore();

            let wordIndex = keywords.indexOf(word);
            keywords.splice(wordIndex, 1); // Delete the matched keyword
        }
    });
}

function updateScore() {
    var score = 0;
    checkmarks.forEach(checkmark => {
        if (checkmark.done) {
            score++;
        }
    });
    document.getElementById("score").innerHTML = score;
}


function checkCodeByLine(editorLines) {
    var currentCheckmark = 0;

    if (!(currentCheckmark === checkmarks.length)) {

        editorLines.forEach(line => {
            if (currentCheckmark < checkmarks.length) {
                if (line.includes(checkmarks[currentCheckmark].answer)) {
                    checkmarks[currentCheckmark].done = true;
                    checkCheckmarks();
                    console.log(checkmarks.length);
                    console.log(currentCheckmark);
                    currentCheckmark++;
                }

            }
        });

    }

    editorLines.forEach(line => {
        if (currentCheckmark < checkmarks.length) {
            if (!(line.includes(checkmarks[currentCheckmark].answer))) {
                checkmarks[currentCheckmark].done = false;
                checkCheckmarks();
            }

        }

    });

    updateScore();
}

var tempCtr = 0;
function whenPlayerAttack(){

    if(tempCtr < checkmarks.length){
        if(checkmarks[tempCtr].done){
            playerAttack();
            tempCtr++;
        }
    }
}


editor.session.on('change', function (delta) {
    //setEditorCode();
    //checkCode();
    var editorValue = editor.getValue();
    var editorLines = editorValue.split("\n");


    console.log(editorLines);
    checkCodeByLine(editorLines);
    whenPlayerAttack();
});

function runClick() {

    const req1 = new window.XMLHttpRequest();

    var input = {
        code: editor.getValue()
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


function startIntervalTimer() {

    let time1 = 10;
    const timer1 = setInterval(function () {
        time1--;
        document.getElementById("timer").innerHTML = time1;
        if (time1 === 0) {
            clearInterval(timer1);
            console.log("Time's up!");
        }
    }, 1000);

    let rounds = 5;
    const timer = setInterval(function () {

        let time = 10;
        const timer2 = setInterval(function () {
            document.getElementById("timer").innerHTML = time;
            time--;
            if (time === 1) {
                clearInterval(timer2);
            }
        }, 1000);

        rounds--;
        console.log(rounds);
        monsterAttack();

        if (rounds === 0) {
            clearInterval(timer);
            clearInterval(timer1);
            clearInterval(timer2);
            console.log("Done!");
            document.getElementById("timer").innerHTML = "Done";
        }
    }, 10000);


}

function displayOutput(output) {
    document.getElementById("output-text").innerHTML = output;
}

startIntervalTimer();

