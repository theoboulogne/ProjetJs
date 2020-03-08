// Exemple de main.js client

(function (){
    const socket = io.connect('http://localhost:8080');

    socket.on('hello', (message) => {
        alert('Le serveur a un message : '+ message)
    });

    function clicked() {
        socket.emit('message', 'Toto', 'salut, comment va ?');
    }

    document.getElementById('clicked').addEventListener('click', clicked);
})()