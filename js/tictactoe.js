/*
 * ===========
 * VARIABLE SETUP
 * ===========
 */

// Keeps track of how far the game has progressed and simulates which player's turn it is
var turn = 1;
var second_timer;
var counter = 3;
// Keeps track of whether the game has finished. Several functions should be disabled when this is true
var game_finished = false;

// Sets up a data structure for keeping track of the Tic Tac Toe game
var game_state = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

// Called when a draw game state is achieved. Alerts the winner, prevents further game progression and shows the reset button.

function win_game(player_name) {
  alert(player_name + ' wins!');
  game_finished = true;
  $('#reset').show();
  clearInterval(second_timer);
}

// Called when a draw game state is achieved. Alerts the draw, prevents further game progression and shows the reset button.

function draw_game() {
  alert('The Game is a Draw');
  game_finished = true;
  $('#reset').show();
  clearInterval(second_timer);
}

// Resets the game state when the reset button is clicked

function reset_game() {
  game_finished = false;
  counter = 3;
  turn = 1;
  game_state = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  $('td').removeClass('xed').removeClass('oed').addClass('blank').text('');
  $(this).hide();
  location.reload();
}

//Takes a parameter of a row number (starting from 0) and checks whether either player has won the game in that row

function check_row(row) {
  if (!game_finished) {
    var row_sum = game_state[row][0] + game_state[row][1] + game_state[row][2];
    switch (row_sum) {
      case 3:
        win_game('Player 1');
        break;
      case -3:
        win_game('Computer');
        break;
    }
  }
}

//Takes a parameter of a col number (starting from 0) and checks whether either player has won the game in that col

function check_col(col) {
  if (!game_finished) {
    var col_sum = game_state[0][col] + game_state[1][col] + game_state[2][col];
    switch (col_sum) {
      case 3:
        win_game('Player 1');
        break;
      case -3:
        win_game('Computer');
        break;
    }
  }
}

//Calls the check_row() function on each row in the game, performing a full horizontal check for an end game state

function check_rows() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_row(i);
  }
}

//Calls the check_col() function on each column in the game, performing a full vertical check for an end game state

function check_cols() {
  for (var i = 0; i < game_state[0].length; i++) {
    check_col(i);
  }
}

// Checks both diagonals for whether a player has won the game

function check_diagonals() {
  var ltr = game_state[0][0] + game_state[1][1] + game_state[2][2];
  var rtl = game_state[0][2] + game_state[1][1] + game_state[2][0];
  switch (ltr) {
    case 3:
      win_game('Player 1');
      break;
    case -3:
      win_game('Computer');
      break;
  }
  switch (rtl) {
    case 3:
      win_game('Player 1');
      break;
    case -3:
      win_game('Computer');
      break;
  }
}

//If the game has progressed past the end of the game, triggers a draw

function check_draw() {
  if (turn > 9 && !game_finished) {
    draw_game();
  }
}

//Checks whether the game has been won or drawn

function check_everything() {
  check_rows();
  check_cols();
  check_diagonals();
  check_draw();
}

// Triggered when a blank cell is clicked. If the game is in progress, marks the cell with the current player's symbol and color, then checks for a win or a draw

function mark_cell() {
  if (!game_finished) {
    counter = 3;
    var row = $(this).parent().data('row');
    var col = $(this).data('col');
    game_state[row][col] = 1;
    $(this).text('X');
    $(this).addClass('xed').removeClass('blank');
    turn += 1;
    check_everything();
    computer_turn();
  }
}

function count_down() {
  console.log('count down');
  $('h4').text(counter);
  counter -= 1;
  if (counter < 0) {
    if (turn % 2 == 1) {
      alert('Computer has Won');
      location.reload(true);
    }
  }
}

function check_openings() {
  var r;
  var c;
  var openings = [];
  for (r = 0; r < game_state[0].length; r++) {
    for (c = 0; c < game_state[0].length; c++) {
      if (game_state[r][c] === 0) {
        var open = [r, c];
        openings.push(open);
      }
    }
  }
  return openings;
}

function computer_turn() {
  if (!game_finished) {
    var openings = check_openings();
    var comp_move = openings[Math.floor(Math.random() * openings.length)];
    console.log(comp_move);
    var x = comp_move[0];
    var y = comp_move[1];
    game_state[x][y] = -1;
    $('#' + x + y).text('O');
    $('#' + x + y).addClass('oed').removeClass('blank');
    turn += 1;
    counter = 3;
    check_everything();
  }
}

function startTimer() {
  console.log('time');
  second_timer = setInterval(count_down, 1000);
}

// Once the document has loaded, set up event handlers for when a user clicks on a cell (td) or the reset button
$(document).ready(function() {
  // Notice that I am using a slightly different version of the standard .click() event. This one uses "delegation", where the table that holds the td elements is delegating the event to its 'td.blank' children
  // .on('click') is recommended over .click()
  $('#tictactoe_board').on('click', '.blank.cell', mark_cell);
  $('#reset').on('click', reset_game);
  $('#start-button').on('click', startTimer);
});
