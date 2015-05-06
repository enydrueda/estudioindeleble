// Evitar los errores de 'console' en browsers que no tienen consola
(function() {
    var metodo,
        falseado = function falseado() {},
        metodos = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        cantidad = metodos.length,
        console = (window.console = window.console || {});

    while (cantidad--) {
        metodo = metodos[cantidad];
        if (!console[metodo]) {
            console[metodo] = falseado;
        }
    }
}());