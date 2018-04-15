$(document).ready(function() {

    /*tic tac toe Modal add */  
    var modal4 = '<div class="modal fade" id="myModal4" role="dialog" style="left: 17%;"><div class="modal-dialog ">';
    var modal_content= '<div class="modal-content" style="display: block;"><div class="modal-header"><h4 class="modal-title">Tic Tac Toe</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div>';
    var tictactoeModal = '<div class="game-container"><div class="game-message"></div><pre></pre><div class="game-board"><div class="game-board-row"><div class="game-board-space" data-space="1,1"></div><div class="game-board-space" data-space="1,2"></div><div class="game-board-space" data-space="1,3"></div></div><div class="game-board-row"><div class="game-board-space" data-space="2,1"></div><div class="game-board-space" data-space="2,2"></div><div class="game-board-space" data-space="2,3"></div></div><div class="game-board-row"><div class="game-board-space" data-space="3,1"></div><div class="game-board-space" data-space="3,2"></div><div class="game-board-space" data-space="3,3"></div></div></div></div>'
    $('#tictactoe_modal').append(modal4 + modal_content + tictactoeModal);
});