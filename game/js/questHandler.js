function triggerQuest(trigger, input) {
    text = game.add.text(32, 32, '', { font: "15px Arial", fill: "#19de65" });
    text.fixedToCamera = true;
    dialogueArray = input;
    nextLine();
}

var dialogueArray;
var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 160;
var lineDelay = 400;

function triggerDialogue() {
}

function nextLine() {

    if (lineIndex === intro.length)
    {
        //  We're finished
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
            game.time.events.add(lineDelay, nextLine, this);
        }
    }, this);

    //  Advance to the next line
    lineIndex++;
}

function triggerSceneChange(trigger, player, game) {

}

var intro = [
    "You are a wage slave for a megacorp.",
    "Each day the corporation bleeds you of your humanity in the name of profit, and gives you a pittance in return.",
    "You've been given an opportunity however...",
    "The corp needs someone to volunteer as a G O L E M  hunter.",
    "You've heard rumours...",
    "But if the pay is a quarter as much as they say, then it's worth it.",
    "Because you've got nothing left to lose, right?"
];
