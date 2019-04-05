var list_count = 0;
$(document).ready(function() {
    $('#btn-list').click((event) => {
        event.preventDefault()
        if (list_count % 2 == 0)
            loadData();
        else
            cancelData();
        list_count++;
    })

    $('#btn-search').click((event) => {
        event.preventDefault()
        const ID = $("#ajax-search input[name=studentID]").val();
        findStudentID(ID);
    })

    $('#btn-add').click((event) => {
        event.preventDefault()
        const ID = $("#ajax-add input[name=studentID]").val();
        const Stname = $("#ajax-add input[name=studentName]").val();

        addStudentID(ID, Stname);
    })

    $('#btn-del').click((event) => {
        event.preventDefault()
        const ID = $("#ajax-del input[name=studentID]").val();
        delStudentID(ID);
    })
});


// const dataURL = "students.json";

function loadData() {
    $.ajax({
        url: 'readJSON',
        type: "POST",
        dataType: "json",
        success: function(Jdata) {
            generateDataHtml(Jdata);
        },
        error: function() {
            alert("ERROR!!!");
        }
    });
}

function generateDataHtml(data) {
    var html_element = ''
    for (key in data) {
        const element = `<h3>"${key}": "${data[key]}"</h3>`;
        html_element += element;
    }
    $("#ajax-output").html(html_element);
}

function cancelData() {
    const element = '';
    $("#ajax-output").html(element);
}

function findStudentID(ID) {
    if (ID == '')
        alert("The columns can't be null, please enter the value");
    else {
        $.ajax({
            url: 'readJSON',
            type: "POST",
            dataType: "json",
            success: function(Jdata) {
                generateNameHtml(Jdata, ID);
            },
            error: function() {
                alert("ERROR!!!");
            }
        });
    }
}


function generateNameHtml(data, ID) {
    if (!data[ID]) {
        alert(`There's no student's ID is ${ID} , please try again.`);
    } else {
        const element = `</br><h1>Hello, ${data[ID]}</h1>`;
        $("#ajax-specific").html(element);
    }
}

function check(value) {
    char = ",;\"\'()<>-+=-?!^&@$%#./\\[]"
    value_arr = String(value).split("")

    for (i = 0; i < value_arr.length; i++) {
        if (char.indexOf(value_arr[i]) >= 0) {
            return true
        }
    }
    return false
}

function addStudentID(ID, Stname) {


    if (ID == '' || Stname == '')
        alert("The columns can't be null, please enter the value");

    else if (check(ID) || check(Stname)) {
        alert("不要亂打特殊字元! 又想駭我逆")
    } else {

        const inputData = {};
        inputData['ID'] = ID;
        inputData['name'] = Stname;

        if (ID == '' || Stname == '')
            alert("The columns can't be null, please enter the value");

        $.ajax({
            url: 'saveJSON',
            type: "POST",
            data: inputData,
            datatype: "json",
            success: function(data) {

                if (data == 'existed') { alert(`The student ID : ${ID} has existed, please check whether it's correct`); } else if (data == 'hack') {
                    alert("拜託你不要再來了嗚嗚")
                } else {
                    alert('Success add!');
                    if (list_count % 2 != 0) { loadData(); }
                }
            },

            error: function(data, sta, type) {
                alert("ERROR!!!")
            }
        })

    }
}

function delStudentID(ID) {
    const inputData = {};

    if (ID == '')
        alert("The columns can't be null, please enter the value");
    else if (check(ID)) {
        alert("不要亂打特殊字元! 又想駭我逆")
    } else {
        inputData['ID'] = ID;

        $.ajax({
            url: 'delJSON',
            type: "POST",
            data: inputData,
            datatype: "json",
            success: function(data) {
                if (data == 'notExisted') { alert(`The student ID : ${ID} has not existed, Please enter the right ID.`); } else {
                    alert('Success delete!');
                    if (list_count % 2 != 0) { loadData(); }
                }
            },
            error: function(data, sta, type) {
                alert("ERROR!!!")
            }
        })

    }
}