$(document).ready(function() {
    let gameSocket = io('http://localhost:3000/game');
    
    gameSocket.on('connect', function () {
        console.log('Connected WS.')
    });

    gameSocket.on('updateRoomList', function (rooms) {
        let tmp = '';
        for (let room in rooms) {
            tmp += '<button type="button" class="join" data-room="' + room +'">'+ room +'</button><br>';
        }

        $('.list-wrapper .items').html(tmp);
    });

    $('.create').click( function() {
        let username = prompt('Username:');
        let roomName = prompt('Room name:');

        gameSocket.emit('createRoom', username, roomName);
        
        $('.connect-wrapper').hide();

        $('.game-wrapper').show();
    });

    $('.list').click( function() {
        $('.connect-wrapper').hide();
        $('.list-wrapper').show();
    });
    
    $('.list-wrapper').on('click', '.join', function() {
        let username = prompt('Username:');

        gameSocket.emit('joinRoom', username, $(this).data('room'));
        
        $('.list-wrapper').hide();

        $('.game-wrapper').show();
    });

    
});