$("body").delegate(".star", "click", function (e, updateStar) {
    e.stopPropagation();
    const recordId = $(this).attr('data-record-id');
    console.log(recordId)
    $(`.star[data-record-id=${recordId}]`).toggleClass("marked");

    setTimeout(`updateStar(${recordId})`, 0);


});


function updateStar(recordId) {
    var userID = "user" + recordId;
    if ($(`.star[data-record-id=${recordId}]`).hasClass("marked")) {
        addStar(userID, "marked")

    } else {
        addStar(userID, "")

    }
}


$("body").delegate("input[name='Check_ctr']", "click", function (e) {
    e.stopPropagation();
});



$("body").delegate(".case", "click", function (e) {
    // e.stopPropagation();
    const recordId = $(this).attr('data-record-id');
    $(window).attr('location', 'index.html?user=user' + recordId)

});
$(document).ready(function () {
    loadCaseData();
})

function loadCaseData() {
    $.ajax({
        url: 'readCase',
        type: "POST",
        dataType: "json",
        success: function (Jdata) {
            fillCaseData(Jdata);
        },
        error: function () {
            alert("ERROR!!!");
        }
    });
}


function fillCaseData(data) {
    var userlist = ['user1', 'user2'];
    var dataId = 0
    for (item of userlist) {
        console.log(item)
        dataId += 1;
        let infoType = Object.keys(data[item]["case"]);
        // console.log("I", infoType);
        // for (dataId = 1; dataId < 3; dataId++) {
        for (i = 0; i < infoType.length; i++) {
            // console.log("i", data[item]["case"][`${infoType[i]}`]);

            if (infoType[i] == "star") {
                if (data[item]["case"][`${infoType[i]}`] == "marked") {
                    $(`.case[data-record-id=${dataId}] img`).addClass("marked")
                }

            } else if (infoType[i] == "Check_ctr") {
                if (data[item]["case"][`${infoType[i]}`] == "yes") {
                    $(`.case[data-record-id=${dataId}] .checkbox`).val("yes")
                }





            } else {
                $(`.case[data-record-id=${dataId}] .S5content[name=${infoType[i]}]`).text(data[item]["case"][`${infoType[i]}`])
            }
        }
        // }

    }
}


function addStar(user, mark) {

    // if (tag == '') {
    //     alert("The columns can't be null, please enter the value");
    // } else if (check(tag)) {
    //     alert("不要亂打特殊字元! 又想駭我逆")
    // } else {
    //     console.log("TT", tag)

    const inputData = {};
    inputData["user"] = user
    inputData['starMark'] = mark;
    // inputData['user'] = user;
    $.ajax({
        url: 'saveStarJSON',
        type: "POST",
        data: inputData,
        datatype: "json",
        success: function (data) {
            if (data == 'done') {

                // if (data == 'existed') {
                // alert(`The student ID : ${ID} has existed, please check whether it's correct`);
                // } else if (data == 'hack') {
                // alert("拜託你不要再來了嗚嗚")
                // } else {
                // alert('Star success add!');
                // if (list_count % 2 != 0) {
                loadCaseData();
                // }
                // }
            }
        },

        error: function (data, sta, type) {
            alert("ERROR!!!")
        }
    })

    // }
}

// function  to (){    
//     var  getval =document.getElementById("cc").value;    
//     document.location.href("b.html?cc="+getval);       
//   }    