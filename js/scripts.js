var player1 = new Player("Player 1");
var player2 = new Player("Player 2");

var game = new Game();

function Game(){
  this.gameType = 1;
  this.players = 1;
  this.currentRoll = [];
  this.currentPlayer = player1;
  this.turnTotal = 0;
}

function Player(name){
  this.bank = 0;
  this.name = name;
}

Player.prototype.addToBank = function() {
  this.bank += game.turnTotal;
  game.turnTotal = 0;
}

Player.prototype.addName = function(name) {
  this.name = name;
}

Game.prototype.setGameType = function (type, players) {
  this.gameType = type;
  this.players = players;
}

Game.prototype.rollDice = function() {
  this.currentRoll = [];
  for(var i=0; i<this.gameType; i++) {
    this.currentRoll.push(Math.floor((Math.random()*6)+1));
  }

  if (this.currentRoll[1]) {
    if (this.currentRoll[0] === 1 && this.currentRoll[1] === 1){
      this.currentPlayer.bank=0;
      this.turnTotal = 0;
      this.switchPlayer();
      window.setTimeout(activePlayerUI, 1000);
      updateBank();
    } else if (this.currentRoll[0] === 1 || this.currentRoll[1] === 1){
      this.turnTotal = 0;
      this.switchPlayer();
      window.setTimeout(activePlayerUI, 1000);
    } else  {
      this.turnTotal += (this.currentRoll[0] + this.currentRoll[1]);
      return 1;
    }
  } else {
    if (this.currentRoll[0] === 1) {
    this.turnTotal = 0;
    this.switchPlayer();
    window.setTimeout(activePlayerUI, 1000);
    } else {
      this.turnTotal += this.currentRoll[0];
        if (this.currentPlayer.bank + this.turnTotal >= 100) {
          win();
        } return 1;
      }
    }
} // rollDice

Game.prototype.switchPlayer = function() {
  if (this.currentPlayer === player1) {
    this.currentPlayer = player2;
  } else {
    this.currentPlayer = player1;
  }
  if (this.players === "1" && this.currentPlayer === player2) {
    window.setTimeout(computer, 2000, type);
  }
}

var computer = function() {
  var firstRoll = game.rollDice();
  displayRoll(game.currentRoll);
  updateFields();

  if (firstRoll === 1){
    firstRoll = game.rollDice();
    window.setTimeout(displayRoll, 1000, game.currentRoll);
    window.setTimeout(updateFields, 1000);
  }
  if (firstRoll === 1){

    window.setTimeout(game.currentPlayer.addToBank(game.turnTotal), 1000);
    window.setTimeout(game.switchPlayer(), 1000);
    window.setTimeout(activePlayerUI, 3000);
  }
  window.setTimeout(updateBank, 3000);

}
/// UI

var activePlayerUI = function() {
  if (game.currentPlayer.name === player1.name) {
    $("#player1Working").addClass("currentPlayer");
    $("#player2Working").removeClass("currentPlayer");
  } else {
    $("#player2Working").addClass("currentPlayer");
    $("#player1Working").removeClass("currentPlayer");
  }
  $("#currentPlayer").text(game.currentPlayer.name);
}

var updateBank = function() {
  $("#p1BankTotal").text(player1.bank);
  $("#p2BankTotal").text(player2.bank);
}

var displayRoll = function() {
  for (var i=0; i<game.gameType; i++) {
    var output1 = "&#x268" + (game.currentRoll[i]-1) + ";";
    $(".displayDice"+(i+1)).html(output1);
  }
}

var updateFields = function() {
  $("#p1BankTotal").text(player1.bank);
  $("#p2BankTotal").text(player2.bank);
  $("#turnTotal").text(game.turnTotal);
  $("#currentPlayer").text(game.currentPlayer.name);
}

var clearFields = function() {
  $("#rollOutput").text("");
  $("#turnTotal").text("");
  $("#currentPlayer").text("");
}

var win = function() {
  $("#winner").show();
  $("#winner").text(game.currentPlayer.name + " Wins! Bank: " + game.currentPlayer.bank + " Current roll:" + turnTotal);
  $("#startGame").show();
  $("#rollButton").hide();
  $("#bankButton").hide();
  clearFields();
}

$(document).ready(function(){

  $("#gameType").change(function() {
    var diceNumber = $("#gameType").val();
    if (diceNumber === "1") {
      $("#twoDice").hide();
      $("#oneDie").show();
    } else {
      $("#twoDice").show();
      $("#oneDie").hide();
    }

  });

  $("#startGame").click(function() {
    game = new Game();
    player1 = new Player("Player 1");
    player2 = new Player("Player 2");
    updateBank();
    $("#gameStart").hide();
    $(".nameEntry1").show();
    $("#winner").hide();
    $("#p1NameOutput").text("Player 1");
    $("#p2NameOutput").text("Player 2");
    var type = $("#gameType").val();
    var players = $("#playerCount").val();
    game.setGameType(type, players);
    activePlayerUI();
  });

  $("#rollButton").click(function() {
    game.rollDice();
    displayRoll(game.currentRoll);
    updateFields();
  });

  $("#bankButton").click(function() {
    game.currentPlayer.addToBank(turnTotal);
    updateBank();
    game.switchPlayer();
    activePlayerUI();
    $("#rollOutput").text("");
    $("#turnTotal").text("");
    $("#currentPlayer").text(game.currentPlayer.name);
  });

  $("#p1NameSubmit").click(function(){
    var name = $("#p1Name").val();
    player1.addName(name);
    $("#p1NameOutput").text(player1.name);
    $(".nameEntry1").hide();
    $(".nameEntry2").show();
    $("#player2Working").addClass("currentPlayer");
    $("#player1Working").removeClass("currentPlayer");
  });

  $("#p2NameSubmit").click(function(){
    var name = $("#p2Name").val();
    player2.addName(name);
    $("#p2NameOutput").text(player2.name);
    $(".nameEntry2").hide();
    $("#player1Working").addClass("currentPlayer");
    $("#player2Working").removeClass("currentPlayer");
    $("#rollButton").show();
    $("#bankButton").show();
  });

});
