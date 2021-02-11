$(document).ready(function(){
    
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const board = $('#board');

    // Generate board
    for (let i = 0; i < alpha.length; i++) {
        let file = '';
        for (let ii = 1; ii <= 8; ii++) {
            file += `<div class="square" data-x="${alpha[i]}" data-y="${ii}"></div>`;
        }
        board.append(`<div class="file">${file}</div>`);
    }

    // Populate board
    $.getJSON('assets/js/setup.json', function(data) {
        for (const piece of data.pieces) {
            const square = $(`.square[data-x="${piece.x}"][data-y="${piece.y}"]`);
            square.append(`<div class="piece" style="background-image:url(assets/img/${piece.color}_${piece.type}.png)"></div>`);
        }
    });

    // Make pieces draggable
    const droppable = new Droppable.default(document.querySelectorAll('#board'), {
        draggable: '.piece',
        dropzone: '.square',
        mirror: {
            // appendTo: '.board',
            constrainDimensions: true,
        },
    });

    // Events
    let droppableOrigin;
    let move = {from: null, to: null};

    droppable.on('draggable:start', (evt) => {
        droppableOrigin = evt.originalSource.parentNode.dataset.dropzone;
        // $('.square').addClass('draggable-dropzone--active'); // TODO
    });

    droppable.on('droppable:start', (evt) => {
        const square = $(evt.data.dropzone);
        const coords = {x: square.data('x'), y: square.data('y')};
        move.from = coords;
    });
    
    droppable.on('droppable:dropped', (evt) => {
        if (droppableOrigin !== evt.dropzone.dataset.dropzone) {
            evt.cancel();
        }
    });

    droppable.on('droppable:stop', (evt) => {
        const square = $(evt.data.dropzone);
        const coords = {x: square.data('x'), y: square.data('y')};
        move.to = coords;
        if (pieceMoved(move)){ 
            highlightMove(move);
            if (square.find('.piece').length > 1) square.find('.piece:nth-child(1)').remove(); // capture
            console.log(moveToString(move));
        } 
    });

    // Settings panel
    $('#toggleSettings').click(function(){
        $('#settings').toggle();
    });

    $('#flipBoard').click(function(){
        board.toggleClass('flipped');
    });

});

function highlightMove(move){
    $('.square').removeClass('highlight');
    $(`.square[data-x='${move.from.x}'][data-y='${move.from.y}'], .square[data-x='${move.to.x}'][data-y='${move.to.y}']`).addClass('highlight');
}

function pieceMoved(move){ // TODO: server side validation
    return !(move.from.x == move.to.x && move.from.y == move.to.y);
}

function moveToString(move){
    return move.from.x+move.from.y+move.to.x+move.to.y;
}