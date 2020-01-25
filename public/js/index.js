function loadComments() {
    let url = 'http://localhost:8081/blog-api/comentarios';
    let settings = {
        method: "GET"
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJSON => {
            displayResults(responseJSON);
        });
}

function displayResults(responseJSON) {
    $('#comentarios').empty();
    for (let i = 0; i < responseJSON.length; i++) {
        $('#comentarios').append(
            `<li>
                <h3>${responseJSON[i].titulo}</h3>
                <h5> ID: ${responseJSON[i].id}</h5>
                <div class="autorFecha">${responseJSON[i].autor} <span>${responseJSON[i].fecha}</span></div>
                <div>${responseJSON[i].contenido}</div>
            </li>
        `);
    }
}

function displayAutor(responseJSON) {
    $('#comentAutor').empty();
    for (let i = 0; i < responseJSON.length; i++) {
        $('#comentAutor').append(
            `<li>
                <h3>${responseJSON[i].titulo}</h3>
                <h5> ID: ${responseJSON[i].id}</h5>
                <div class="autorFecha">${responseJSON[i].autor} <span>${responseJSON[i].fecha}</span></div>
                <div>${responseJSON[i].contenido}</div>
            </li>
        `);
    }
}

function watchRemove() {
    let form = document.getElementById('borrar');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let id = document.getElementById('bId');
        let url = 'http://localhost:8081/blog-api/remover-comentario/' + id.value;
        let settings = {
            method: "DELETE"
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    document.getElementById('borrarE').style.display = 'none';
                    return response.json();
                }
                else {
                    document.getElementById('borrarE').innerHTML = `${response.statusText}`;
                    document.getElementById('borrarE').style.display = 'initial';
                }
            })
            .then(responseJSON => {
                loadComments();
            });
    });
}


function watchNewComm() {
    let form = document.getElementById('nuevoComent');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let vAutor = document.getElementById('nAutor');
        let vTitulo = document.getElementById('nTitulo');
        let vContenido = document.getElementById('nComentario');
        let url = 'http://localhost:8081/blog-api/nuevo-comentario';
        let data = {
            autor: vAutor.value,
            titulo: vTitulo.value,
            contenido: vContenido.value
        }
        let settings = {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(data)
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    document.getElementById('nuevoComentE').style.display = 'none';
                    vAutor.value = '';
                    vContenido.vContenido = '';
                    vTitulo.value = '';
                    return response.json();
                }
                else {
                    document.getElementById('nuevoComentE').innerHTML = `${response.statusText }`;
                    document.getElementById('nuevoComentE').style.display = 'initial';
                }
            })
            .then(responseJSON => {
                loadComments();
            });

    });
}

function watchUpdate() {
    let form = document.getElementById('actualiza');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let vId = document.getElementById('aId');
        let vAutor = document.getElementById('aAutor');
        let vTitulo = document.getElementById('aTitulo');
        let vContenido = document.getElementById('aComentario');
        let url = 'http://localhost:8081/blog-api/actualizar-comentario/' + vId.value;
        let settings = {
            method: "PUT",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({
                id: vId.value,
                autor: vAutor.value,
                titulo: vTitulo.value,
                contenido: vContenido.value
            })
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    document.getElementById('actualizaE').style.display = 'none';
                    vAutor.value = '';
                    vContenido.vContenido = '';
                    vTitulo.value = '';
                    vId.value = '';
                    return response.json();
                }
                else {
                    document.getElementById('actualizaE').innerHTML = `${response.statusText}`;
                    document.getElementById('actualizaE').style.display = 'initial';
                }
            })
            .then(responseJSON => {
                loadComments();
            });
    });
}

function watchFilterAuthor() {
    let form = document.getElementById('getAutor');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let autor = document.getElementById('porAutor');
        console.log(autor.value);
        let url = 'http://localhost:8081/blog-api/comentarios-por-autor?autor='+autor.value;
        let settings = {
            method: "GET"
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    document.getElementById('getAutorE').style.display = 'none';
                    autor.value = '';
                    return response.json();
                }
                else {
                    document.getElementById('getAutorE').innerHTML = `${response.statusText}`;
                    document.getElementById('getAutorE').style.display = 'initial';
                }
            })
            .then(responseJSON => {
                displayAutor(responseJSON);
            });
    });
}

function init() {
    loadComments();
    watchFilterAuthor();
    watchRemove();
    watchUpdate();
    watchNewComm();
}

init();
