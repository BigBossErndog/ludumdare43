function triggerQuest(trigger, input) {
    text = game.add.text(15, 15, '', { font: "13px Arial", fill: "#0a8293", tabs: 50, wordWrap: true, wordWrapWidth: 300 });
    text.fixedToCamera = true;
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

function triggerDialogue(trigger, talker, input) {
    var x, y;
    x = talker.head === undefined ? talker.body.x : talker.com.x;
    y = talker.head === undefined ? talker.body.y : talker.com.y;


}

function triggerSceneChange(trigger, player, game) {

}

var intro = [
    "You are a wage slave for a megacorp.",
    "Each day the corporation bleeds you of your humanity in the name of profit, and gives you a pittance in return.",
    "You've been given an opportunity however...",
    "The corp needs someone to volunteer as a G.O.L.E.M. hunter, an  individual  who  finds  and \"recalls\" these G.O.L.E.M.s, artifical intelligence built  for human convenience.",
    "You've heard rumours...",
    "But if the pay is a quarter as much as they say, then it's worth it.",
    "Because you've got nothing left to lose,",
    "",
    "                                        right?"
];
