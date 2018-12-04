function triggerQuest(trigger, input) {
    text = game.add.text(15, 15, '', { font: "13px Arial", fill: "#0a8293", tabs: 50, wordWrap: true, wordWrapWidth: 300 });
    text.fixedToCamera = true;
    wordIndex = 0;
    lineIndex = 0;
    dialogueArray = input;
    nextLine(trigger);
}

var dialogueArray;
var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 160;
var lineDelay = 400;


function nextLine(trigger) {

    if (lineIndex === intro.length)
    {
        //  We're finished
        trigger.finished = true;
        return;
    }

    //  Split the current line on spaces, so one word per array element
    line = dialogueArray[lineIndex].split(' ');

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(wordDelay, line.length, function () {
        //  Add the next word onto the text string, followed by a space
        text.text = text.text.concat(line[wordIndex] + " ");

        //  Advance the word index to the next word in the line
        wordIndex++;

        //  Last word?
        if (wordIndex === line.length)
        {
            //  Add a carriage return
            text.text = text.text.concat("\n");

            //  Get the next line after the lineDelay amount of ms has elapsed
            game.time.events.add(lineDelay, function() {
                nextLine(trigger);
            }, this);
        }
    }, this);

    //  Advance to the next line
    lineIndex++;
}

var index;
function triggerDialogue(talker, line) {
    console.log(talker);
    var textBox = game.add.text(0, 0, "", dialogueStyle);
    var x, y;
    player.locked = true;
    x = talker.head === undefined ? talker.x : talker.com.x;
    y = talker.head === undefined ? talker.y : talker.com.y;
    var index = 0;
    console.log(index);

    // game.time.events.repeat(lineDelay, lineArray.length, printLine, this, lineArray, index, x, y, textBox);
    // for (var i = 0; i < lineArray.length; i++) {
    //     game.time.events.add(lineDelay * (i + 1), function() {
    //         console.log("printing");
    //         if (i === lineArray.length) {
    //             console.log("print over");
    //             // trigger.destroy();
    //             return;
    //         }
    //
    //         console.log(index);
    //         textBox.text = lineArray[i];
    //         //add a repeat in here to continually update the textBox position if the speaker moves when talking
    //         // game.time.events.add(lineDelay, printLine, this, lineArray, index++, x, y, textBox, trigger);
    //     });
    // }
    textBox.x = x - 30;
    textBox.y = y + 20;
    textBox.text = line;
    game.time.events.add(lineDelay, function () {
        player.locked = false;
    });

}

function printLine(lineArray, index, x, y, textBox) {
}

var intro = [
    "You are a wage slave for a megacorp.",
    "Each day the corporation bleeds you of your humanity in the name of profit, and gives you a pittance in return.",
    "You've been given an opportunity however...",
    "The corp needs someone to volunteer as a G.O.L.E.M. hunter, an individual who finds and \"recalls\" these G.O.L.E.M.s, artifical intelligence built for human convenience.",
    "It's not pretty work, but if the pay is half as much as they say, then it's worth it.",
    "Because you've got nothing left to lose,",
    "Right?"
];
//
// var outro = [
//     "So you finished the contract.",
//     "You've escaped from the pits of despair that is life under the corp's heel.",
//     "You think you're out though? What bits of you are left that aren't chrome and silicon?",
//     "",
//     "Did you resist the temptation?",
//     "",
//     "Colt҉̵͜ę͡ŗ͏ą͞l̸͠l͏~ sons, daughters, mothers, fathers killed: " + totalDeadInnocents + "  ",
//     "G̶̵̵Ó̵̧LEMS ret̴́́͝i̴͏͢͏r͟͝e̷͏̶d̢̨~ new lives extinguished: " + totalGolemsKilled + "  "
// ];
