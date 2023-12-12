var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/java");

let checkmarks = [];

var checkmark1 = {
    instruction: "Create a variable called 'first' and assign it to 10",
    answer: "int first = 10;",
    done: false
}

var checkmark2 = {
    instruction: "Create a variable called 'second' and assign it to 20",
    answer: "int second = 20;",
    done: false
}

function pushCheckmarks(checkmark) {
    checkmarks.push(checkmark);
}

pushCheckmarks(checkmark1);
pushCheckmarks(checkmark2);

let score = 0;

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




function checkCode() {
    var input = editor.getValue();
    var inputWords = input.split(/[.\s(){}'""\[\]`]+/).filter((word) => word.trim() !== "");


    inputWords.forEach(word => {
        if (keywords.includes(word)) {
            score++;
            document.getElementById("score").innerHTML = "Score:" + score;

            let wordIndex = keywords.indexOf(word);
            keywords.splice(wordIndex, 1); // Delete the matched keyword
        }
    });
}

editor.session.on('change', function (delta) {
    checkCode();
});



function startIntervalTimer() {

    let time1 = 10;
    const timer1 = setInterval(function () {
        time1--;
        document.getElementById("timer").innerHTML = "Time:" + time1;
        if (time1 === 0) {
            clearInterval(timer1);
            console.log("Time's up!");
        }
    }, 1000);

    let rounds = 5;
    const timer = setInterval(function () {

        let time = 10;
        const timer2 = setInterval(function () {
            document.getElementById("timer").innerHTML = "Time:" + time;
            time--;
            if (time === 1) {
                clearInterval(timer2);
            }
        }, 1000);

        rounds--;
        console.log(rounds);
        checkCode();

        if (rounds === 0) {
            clearInterval(timer);
            clearInterval(timer1);
            clearInterval(timer2);
            console.log("Done!");
            document.getElementById("timer").innerHTML = "Done";
        }
    }, 10000);


}

function getEditorCode() {
    document.getElementById("code").value = editor.getValue();
    console.log(document.getElementById("code").value);
}


