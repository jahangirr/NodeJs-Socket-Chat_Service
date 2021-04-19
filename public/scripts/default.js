var socket;
var tempUserName = '';
var isFromFileUpload = 0;
$(document).ready(function () {
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    socket.on('user image', imageProcess);
    socket.on('sendchat',tempUserName);
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);
    
    $('#uploadfile').on('change', function (e) {
        isFromFileUpload = 1;
        var file = e.originalEvent.target.files[0],
            reader = new FileReader();
            reader.onload = function (evt) {
                socket.emit('user image', evt.target.result);
                socket.emit('sendchat', 'uploaded by ' + tempUserName );

                var canv = document.createElement("canvas");
                var id =  document.getElementById("conversation").childElementCount + 1;
                canv.setAttribute("id", id);
                var ctx = canv.getContext('2d');
                var myImage = new Image();
                myImage.src = evt.target.result;
                myImage.onload = function () {
                    ctx.drawImage(myImage, 0, 0);
                }

                var elementList =  document.getElementById("conversation");
                elementList.insertBefore(canv,elementList.firstChild);
               // eElement.insertBefore(newFirstElement, eElement.firstChild);
               //var lastElement =   document.getElementById(id.toString())
               // document.getElementById("conversation").appendChild(canv);
        };
        //And now, read the image and base64
        reader.readAsDataURL(file);
       
    });

  
});


function imageProcess( username , msg) {

    if (isFromFileUpload == 0) {

        var canv = document.createElement("canvas");
        var id =  document.getElementById("conversation").childElementCount + 1;
        canv.setAttribute("id", id);
        var ctx = canv.getContext('2d');
        var img1 = new Image();
        img1.onload = function () {
            ctx.drawImage(img1, 0, 0);
        }
        img1.src = msg;
       
        var elementList =  document.getElementById("conversation");
        elementList.insertBefore(canv,elementList.firstChild);
    }

}


function addUser() {
    tempUserName = prompt("What's your name?");
    socket.emit('adduser', tempUserName  );
}
function processMessage(username, data) {

    var canv = document.createElement("canvas");
    canv.height = 60 ;
    var id =  document.getElementById("conversation").childElementCount + 1;
    canv.setAttribute("id", id);
    var ctx = canv.getContext('2d');
    var userNameWithText = username + ' : ' + data;
    ctx.font = '16px serif'; 
    ctx.fillText(userNameWithText, 5, 15);
    var elementList =  document.getElementById("conversation");
    elementList.insertBefore(canv,elementList.firstChild);
}
function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
}
function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
    $('#data').focus();
}
function processEnterPress(e) {
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}