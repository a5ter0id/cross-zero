$(document).ready(function(){
    if(document.getElementById('historyBlock') !== null)
        $(function(){
            let socket = io.connect();

            socket.on('connect', function(data) {
                socket.emit('getHistory');
            });

            socket.on('history', function(data) {
                console.log("history: " + data);
                socket.disconnect();

                let history = JSON.parse(data);

                function tableCreate(){

                    let body = document.body;
                    let tbl  = document.createElement('table');

                    tbl.style.width  = '100%';
                    tbl.style.border = '1px solid black';

                    let tr = tbl.insertRow();
                    let td;

                    td = tr.insertCell();
                    td.appendChild(document.createTextNode("N"));
                    td.style.border = '1px solid black';
                    td.style.backgroundColor = "grey";

                    td = tr.insertCell();
                    td.appendChild(document.createTextNode("Дата"));
                    td.style.border = '1px solid black';
                    td.style.backgroundColor = "grey";

                    td = tr.insertCell();
                    td.appendChild(document.createTextNode("Результат"));
                    td.style.border = '1px solid black';
                    td.style.backgroundColor = "grey";

                    td = tr.insertCell();
                    td.appendChild(document.createTextNode("Журнал ходов"));
                    td.style.border = '1px solid black';
                    td.style.backgroundColor = "grey";

                    for(let rowId = 0; rowId < history.length; rowId++){
                        tr = tbl.insertRow();
                        let item = history[rowId].history;

                        td = tr.insertCell();
                        td.appendChild(document.createTextNode(rowId+1));
                        td.style.border = '1px solid black';
                        td.style.backgroundColor = (history[rowId].result.rez < 0 ? "red" :
                            history[rowId].result.rez > 0 ? "lime" : "gray");

                        td = tr.insertCell();
                        td.appendChild(document.createTextNode(history[rowId].dtReport));
                        td.style.border = '1px solid black';
                        td.style.backgroundColor = (history[rowId].result.rez < 0 ? "red" :
                            history[rowId].result.rez > 0 ? "lime" : "gray");

                        td = tr.insertCell();
                        td.appendChild(document.createTextNode(history[rowId].result.rez < 0 ? "Поражение" :
                            history[rowId].result.rez > 0 ? "Выигрышь" : "Ничья"));
                        td.style.border = '1px solid black';
                        td.style.backgroundColor = (history[rowId].result.rez < 0 ? "red" :
                            history[rowId].result.rez > 0 ? "lime" : "gray");

                        td = tr.insertCell();
                        let message = "";
                        for(let id = 0; id < item.length; id++){
                            message += "["+ item[id].x + "," + item[id].y + "]: " +
                            (item[id].value === -1 ? "0" : "X") + (id < item.length - 1 ? ", " : "");
                        }
                        message += " => " + (history[rowId].result.rez < 0 ? "Lose" :
                                history[rowId].result.rez > 0 ? "Win" : "Draw");

                        td.appendChild(document.createTextNode(message));
                        td.style.border = '1px solid black';
                        td.style.backgroundColor = (history[rowId].result.rez < 0 ? "red" :
                            history[rowId].result.rez > 0 ? "lime" : "gray");
                    }
                    body.appendChild(tbl);
                }
                tableCreate();
            });
        });
});
