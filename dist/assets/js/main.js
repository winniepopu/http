/*section-1*/
// window.onbeforeunload = confirmExit;

// function confirmExit() {
//     return "Are you sure you want to exit this page?";
// }
// 抓user變數
var clicknum = 0;
var user = findUser()

function findUser() {
    var thisURL = document.URL;
    var getval = thisURL.split('?')[1];
    if (typeof (getval) != 'undefined') {
        var user = getval.split("=")[1];

        console.log("USER:", user);
        return user
    } else {
        return "user1"
    }
}

$(document).ready(function () {

    loadData(user);
    notice();
    checkS2AWidth();
    // tag();
    save();
    shrinkclick();
    window.onload = function () {
        var olink1 = document.getElementById("S1A7content1");
        var olink2 = document.getElementById("S1A7content2");
        var olink3 = document.getElementById("S1A7content3");
        olink1.onclick = function () {
            olink1.style.color = "red";
            olink2.style.color = "white";
            olink3.style.color = "white";
        }
        olink2.onclick = function () {
            olink2.style.color = "red";
            olink1.style.color = "white";
            olink3.style.color = "white";
        }
        olink3.onclick = function () {
            olink3.style.color = "red";
            olink1.style.color = "white";
            olink2.style.color = "white";
        }
    }
    $("#S1A1img").click(function () {
        $("#S1Arow2").slideToggle("slow");
    });
    $("#S1A3img").click(function () {
        $("#S1Arow4").slideToggle("slow");
    });
    $("#S1A1img6").click(function () {
        $("#S1Arow7").slideToggle("slow");
    });


    $(".db-bt").click(function (event) {
        if ($("#side-2").hasClass("off")) {
            $("#side-2").css("display", "block");
        } else {
            $("#side-2").css("display", "none");
        }
        $("#side-2").toggleClass("off");
        checkS2AWidth();
        // shrinkclick();
    });

    $("body").delegate(".loan", "click", function (e) {
        var page = "loan";
        if ($(this).parent().is('.lc')) {
            console.log("a1")
            SwitchPages(page, 1); //左
            $(".lc .on").removeClass("on")
            $(".lc .loan").toggleClass("on")
        } else {
            console.log("a2")
            SwitchPages(page, 2); //右
            $(".rc .on").removeClass("on")
            $(".rc .loan").toggleClass("on")

        }
        checkS2AWidth();
        shrinkclick();
    });
    $("body").delegate(".record", "click", function (e) {

        var page = "record";
        if ($(this).parent().is('.lc')) {
            console.log("a1")
            SwitchPages(page, 1); //左
            $(".lc .on").removeClass("on")
            $(".lc .record").toggleClass("on")


        } else {
            console.log("a2")
            SwitchPages(page, 2); //右
            $(".rc .on").removeClass("on")
            $(".rc .record").toggleClass("on")
        }

        // shrinkclick();
        notice();
        checkS2AWidth();
        loadData(user);
        // tag();
        save();


    });
})

var analysis = 1;
$("#analysis-bt").click(function () {
    if (window.analysis == 1) {
        $(".analysis").show();
        $("#analysis-chart").show();
        $("#analysis-option").show();


        window.analysis = 0;
    } else if (window.analysis == 0) {
        $(".analysis").hide();
        $("#analysis-chart").hide();
        $("#analysis-option").hide();
        window.analysis = 1;
    }
});



function loadData(user) {
    $.ajax({
        url: 'readJSON',
        type: "POST",
        data: {
            "user": user
        },
        dataType: "json",
        success: function (Jdata) {
            console.log("loadData:", Jdata)
            fillS2AData(Jdata["rawcontent"])
            fillUserData(Jdata["info"])
            fillData(Jdata["content"]);
            tag(Jdata["availableTags"]);
            loadTag(Jdata["availableTags"])

        },
        error: function () {
            alert("ERROR!!!");
        }
    });
}

// function loadTagData() {
//     $.ajax({
//         url: 'readJSON',
//         type: "POST",
//         dataType: "json",
//         success: function (Jdata) {
//             fillTagData(Jdata);
//         },
//         error: function () {
//             alert("ERROR!!!");
//         }
//     });
// }



function fillUserData(data) {
    let infoType = Object.keys(data);
    var name = data["username"].split('/')[0];
    var depart = data["username"].split('/')[1]
    console.log(name)
    $("#S1Amen").text(name)
    $(".dpt").text(depart)


    for (i = 0; i < infoType.length; i++) {
        $(`.S2A1content[name=${infoType[i]}]`).text(data[`${infoType[i]}`])
    }
}

function fillS2AData(data) {
    console.log("refresh!!")
    // console.log("++", data)
    let loanType = Object.keys(data);
    // console.log(loanType);

    // let loanType = ['product', 'SumPeriod', 'value', 'accountBalence', 'interest'];

    for (i = 0; i < loanType.length; i++) {

        if (loanType[i] == "guarantor" || loanType[i] == "riskPricing") {
            // $(`input[name=${loanType[i]}]`).attr("checked", data[`${loanType[i]}`]);
            $(`.S2content1[name=${loanType[i]}] img`).attr("src", data[`${loanType[i]}`])

        } else if (loanType[i] == "riskWeight") {
            // var dat = data[`${loanType[i]}`]

            var percentage = data[`${loanType[i]}`] + ",100";
            console.log(percentage)
            $(`.single-chart[name=${loanType[i]}] svg .circle`).attr("stroke-dasharray", percentage)
            $(`.single-chart[name=${loanType[i]}] .percentage`).text(data[`${loanType[i]}`] + "%");
            // console.log(percentage)


        } else {

            if (!isNaN(data[`${loanType[i]}`])) {
                var num = parseFloat(data[`${loanType[i]}`]);
                var newnum = num.toLocaleString('en-US');

                $(`.S2content1[name=${loanType[i]}]`).text(newnum); //加入千分位,
            } else


            // $(".S2content1[name=${loanType[i]}]")
            {
                $(`.S2content1[name=${loanType[i]}]`).text(data[`${loanType[i]}`])
            }
        }
    }
}




function fillData(data) {
    console.log("fill!")
    let loanType = Object.keys(data);
    // console.log(loanType);

    // let loanType = ['product', 'SumPeriod', 'value', 'accountBalence', 'interest'];

    for (i = 0; i < loanType.length; i++) {

        if (loanType[i] == "insurance" || loanType[i] == "common") {
            $(`input[name=${loanType[i]}]`).attr("checked", data[`${loanType[i]}`]);
        } else {


            if (!isNaN(data[`${loanType[i]}`]) && data[`${loanType[i]}`] != "") {
                var num = parseFloat(data[`${loanType[i]}`]);
                var newnum = num.toLocaleString('en-US');
                // console.log("new:", newnum)

                // var inputNum = number_format($(item).val());
                // inputData[itemtype] = inputNum;
                // console.log(inputNum);
                // $(`input[name=${loanType[i]}]`).attr("value", newnum); //加入千分位,
                $(`input[name=${loanType[i]}]`).val(newnum); //加入千分位,
                // $(`input[name=${loanType[i]}]`).val(data[`${loanType[i]}`]);

            } else {
                if (data[`${loanType[i]}`] == "") {
                    // $(`input[name=${loanType[i]}]`).val("");
                } else {
                    $(`input[name=${loanType[i]}]`).val(data[`${loanType[i]}`]);
                }

                // $(`input[name=${loanType[i]}]`).attr("value", data[`${loanType[i]}`]);
            }
        }

    }

    $("textarea[name=description]").text(data['description']);
    // console.log(data['description']);

    // $("input[name=common]").prop("checked", data['common']);
    // $("input[name=insurance]").prop("checked", data['insurance']);

    // ex
    // $("input[name=value]").attr("value", data['value']);

}



function SaveData() {
    // var A = [];
    let inputData = {}
    inputData["user"] = user
    // var i = 0;
    $(".doc-apply input").each(function (index, item) {
        if (item.hasAttribute("name")) {
            var itemtype = $(item).attr("name");
            if ($(item).attr("type") == "checkbox") {

                inputData[itemtype] = $(item).prop('checked');
            } else {
                var value = $(item).val().trim().replace(/,/g, '');
                inputData[itemtype] = value;
            }
        }
    });

    // $("textarea[name=description]").text(data['description']);
    inputData["description"] = $("textarea[name=description]").val();

    // console.log(inputData);


    $.ajax({
        url: 'saveJSON',
        type: "POST",
        data: inputData,
        datatype: "json",
        success: function (data) {

            if (data == 'existed') {
                alert(`The student ID : ${ID} has existed, please check whether it's correct`);
            } else if (data == 'hack') {
                alert("拜託你不要再來了嗚嗚")
            } else {
                myrefresh();
                alert('Success Save!');

                // if (list_count % 2 != 0) {
                //     loadData(user);
                // }
            }
        },

        error: function (data, sta, type) {
            alert("ERROR!!!")
        }
    })

}


function myrefresh() {
    console.log("!!!")
    loadData(user);
    // window.location.reload();
}


function shrinkclick() {
    $(".shrink0").click(function () {

        // if ($(this).parent().parent().is('#ln-part-0')){
        $("#lnPartMainContent").slideToggle("slow");
        if ($(".plus0").hasClass("off")) {
            ;
            $(".plus0").css("display", "inline-block");
            $(".minus0").css("display", "none");

        } else {
            $(".plus0").css("display", "none")
            $(".minus0").css("display", "inline-block");
        }
        $(".shrink0").toggleClass("off");
        // }
    });

    $(".shrink1").click(function () {

        // if ($(this).parent().parent().is('#ln-part-1')){
        $("#lnPart1Content").slideToggle("slow");
        if ($(".plus1").hasClass("off")) {
            ;
            $(".plus1").css("display", "inline-block");
            $(".minus1").css("display", "none");

        } else {
            $(".plus1").css("display", "none")
            $(".minus1").css("display", "inline-block");
        }
        $(".shrink1").toggleClass("off");
        // }
    });


    $(".shrink2").click(function () {
        $("#lnPart2Content").slideToggle("slow");

        if ($(".plus2").hasClass("off")) {
            ;
            $(".plus2").css("display", "inline-block");
            $(".minus2").css("display", "none");

        } else {
            $(".plus2").css("display", "none")
            $(".minus2").css("display", "inline-block");
        }
        $(".shrink2").toggleClass("off");

    });

    $(".shrink3").click(function () {
        $("#lnPart3Content").slideToggle("slow");

        if ($(".plus3").hasClass("off")) {
            ;
            $(".plus3").css("display", "inline-block");
            $(".minus3").css("display", "none");

        } else {
            $(".plus3").css("display", "none")
            $(".minus3").css("display", "inline-block");
        }
        $(".shrink3").toggleClass("off");

    });


}



function clickcount() {

    console.log("clicknum", clicknum)
    clicknum++;
    if (clicknum % 2 == 0) {
        document.getElementById("section-1").style.marginLeft = "0vw";
        document.getElementById("S1Abutton1").style.marginLeft = "-2.5rem";
        document.getElementById("S1Abutton1").style.display = "none";
    } else {
        document.getElementById("section-1").style.marginLeft = "-15vw";
        setTimeout(buttonDisplay, 400)
    }
}

function buttonDisplay() {
    document.getElementById("S1Abutton1").style.display = "block";
    document.getElementById("S1Abutton1").style.marginLeft = "-2.5rem";
}
$(function () {
    var r = 0;
    // console.log(S)
    $('#S1A1img').click(function () {
        r += 180;
        $(this).css('transform', 'rotate(' + r + 'deg)');
        if (r % 360 == 180) {
            $('#S1Arow3').css('margin-top', '0px');
        } else {
            $('#S1Arow3').css('margin-top', '30px');
        }
        /*$('#S1Arow7img1').css('top', '3rem');
        $('#S1Arow7img2').css('top', '4rem');
        $('#S1Arow7img3').css('top', '7rem');*/
    });
});
$(function () {
    var r = 0;
    $('#S1A3img').click(function () {
        r += 180;
        $(this).css('transform', 'rotate(' + r + 'deg)');
        if (r % 360 == 180) {
            $('#S1Arow5').css('margin-top', '0px');
        } else {
            $('#S1Arow5').css('margin-top', '30px');
        }
        /*$('#S1Arow7img1').css('top', '7.5rem');
        $('#S1Arow7img2').css('top', '8.5rem');
        $('#S1Arow7img3').css('top', '11.5rem');*/
    });
});
$(function () {
    var r = 0;
    $('#S1A1img6').click(function () {
        r += 180;
        $(this).css('transform', 'rotate(' + r + 'deg)');
        if (r % 360 == 180) {
            $('#S1Arow8').css('margin-top', '0px');
        } else {
            $('#S1Arow8').css('margin-top', '30px');
        }
    });
});





/*section-2*/
function SwitchPages(page, side) {
    if (side == 1) {
        var $content = $(`.left_div`);
    } else {
        var $content = $(`.right`);
    }

    var page = page;
    if (page == 'record') {
        // 核貸紀錄
        const newContentHtml = `      
        <div class="doc-apply">
        <div class="indexBar">
            <div class="indexTitle">
                <p class="first-word"> 核貸紀錄 </p>
            </div>

            <div class="index ">
                <a class="index-word in-apply" href="#S2A"> 申請內容 </a>
                </br>
                <a class="index-word in-record" href="#S2B"> 審核紀錄 </a>
                </br>
                <a class="index-word in-opinion" href="#S2D"> 核委意見 </a>
            </div>
        </div>
        <div class="left">
            <div class="content">

                <section class="S2row scrollable-section" id="S2A">
                    <div class="S2subrow S2topic" id="S2Atopic">
                        <p>業務人員申請內容</p>
                    </div>
                    <div class="S2subrow" id="S2Arow1">
                        <div class="S2A1item" id="S2A101">
                            <p class="S2A1title">業務員/單位 :</p>
                            <p class="S2A1content S2A1text">林銘洲/消金業務部</p>
                        </div>
                        <div class="S2A1item" id="S2A102">
                            <p class="S2A1title">核貸總金額 :</p>
                            <p class="S2A1content S2A1number">700000</p>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Arow2">
                        <div class="S2A2colume" id="S2A2colume1">
                            <div class="S2A2item" id="S2A201">
                                <img class="S2AAicon" src="assets//media//S2A01.png">
                                <p class="S2A2title">貸款產品</p>
                                <p class="S2A2content S2A2text">42信用貸款</p>
                            </div>
                            <div class="S2A2item" id="S2A202">
                                <img class="S2AAicon" src="assets//media//S2A02.png">
                                <p class="S2A2title">貸款金額</p>
                                <p class="S2A2content S2A2number">700000</p>
                            </div>
                            <div class="S2A2item" id="S2A203">
                                <img class="S2AAicon" src="assets//media//S2A03.png">
                                <p class="S2A2title">月付金</p>
                                <p class="S2A2content S2A2number">14514</p>
                            </div>
                            <div class="S2A2item" id="S2A204">
                                <img class="S2AAicon" src="assets//media//S2A04.png">
                                <p class="S2A2title">還款方式</p>
                                <p class="S2A2content S2A2text">平均攤還本息</p>
                            </div>
                            <div class="S2A2item" id="S2A207">
                                <img class="S2AAicon" src="assets//media//S2A05.png">
                                <p class="S2A2title">保證人提供</p>
                                <p class="S2A2content S2A2text">否</p>
                            </div>
                            <div class="S2A2item" id="S2A208">
                                <img class="S2AAicon" src="assets//media//S2A06.png">
                                <p class="S2A2title">風險性資產</p>
                                <p class="S2A2content S2A2number">522375</p>
                            </div>
                            <div class="S2A2item" id="S2A209">
                                <img class="S2AAicon" src="assets//media//S2A07.png">
                                <p class="S2A2title">資金用途別</p>
                                <p class="S2A2content S2A2text">家庭週轉金</p>
                            </div>
                            <div class="S2A2item" id="S2A210">
                                <img class="S2AAicon" src="assets//media//S2A08.png">
                                <p class="S2A2title">風險定價期數</p>
                                <p class="S2A2content S2A2text">豐利金一段式</p>
                            </div>
                        </div>
                        <div class="S2A2colume " id="S2A2colume2">
                            <div class="S2A2item1" id="S2A205">
                                <p class="S2A2title">風險定價</p>
                                <div class="S2A2icon1"><img class="S2AAicon1" src="assets//media//S2A09.png"></div>
                            </div>
                            <div class="S2A2item1" id="S2A206">
                                <p class="S2A2title">風險權數</p>
                                <div class="S2A2icon1"><img class="S2AAicon2" src="assets//media//S2A13.png"></div>
                            </div>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Arow3">
                        <div class="S2A3colume" id="S2A3colume1">
                            <div class="S2A3item flex-fill" id="S2A301">
                                <p class="S2A3title">期數</p>
                                <p class="S2A3content">1-60</p>
                            </div>
                            <div class="S2A3item flex-fill" id="S2A302">
                                <p class="S2A3title">利率</p>
                                <p class="S2A3content">105個金放款/房貸指標(月)+7.89%，機動</p>
                            </div>
                        </div>
                        <div class="S2A3colume flex-fill" id="S2A3colume2">
                            <div class="S2A3item flex-fill" id="S2A303">
                                <p class="S2A3title">目前利率</p>
                                <p class="S2A3content">8.95%</p>
                            </div>
                            <div class="S2A3item flex-fill" id="S2A304">
                                <p class="S2A3title">CustType</p>
                                <p class="S2A3content">D</p>
                            </div>
                            <div class="S2A3item flex-fill" id="S2A305">
                                <p class="S2A3title">風險性資產</p>
                                <p class="S2A3content">522375</p>
                            </div>
                            <div class="S2A3item flex-fill" id="S2A306">
                                <p class="S2A3title">風險性資產比率</p>
                                <p class="S2A3content">74.6%</p>
                            </div>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Arow4">
                        <table border="1" class="tb-money table table-bordered dt-responsive nowrap">
                            <tr>
                                <th>+ A 放款利率</th>
                                <th colspan="3">- B 參考價格</th>
                                <th rowspan="2">= C 合理收益</th>
                                <th colspan="2">+ D 整體貢獻度說明</th>
                                <th colspan="4">= E 合理利潤</th>
                            </tr>
                            <tr>
                                <th>預定乘作利率(首年)</th>
                                <th>資金成本</th>
                                <th>營運成本</th>
                                <th>預期風險損失成本</th>
                                <th>手續費率</th>
                                <th>其他貢獻度</th>
                                <th>流動貼水</th>
                                <th>資本成本</th>
                                <th>其他</th>
                                <th>總利潤</th>
                            </tr>
                            <tr>
                                <td>8.95</td>
                                <td>0.534</td>
                                <td>0.271</td>
                                <td>0.271</td>
                                <td>5.805</td>
                                <td>1.143</td>
                                <td>0</td>
                                <td>0.312</td>
                                <td>0.638</td>
                                <td>5.998</td>
                                <td>6.948</td>
                            </tr>
                        </table>
                        
                    </div>
                    <div class="S2analysis S2subrow" id="S2Aanalysis">
                        <div class="S2analysiscont" id="S2Aanalysiscont">
                            
                            <p>請注意 : 為符合銀行法相關規定，請依下列注意事項辦理 :"<p>
                            <p>一、自用住宅放款或消費性放款，不得要求借款人提供連帶保證人；以取得足額擔保時，不得要求借款人提供保證人。</p>
                            <p>二、因自用住宅放款或消費性放款而爭取之保證人，其保證契約自成立之日起，有效期間不得逾十五年，但經保證人書面同意者，不在此限"</p>
                                                       
                        </div>
                        <div class="S2analysisicon" id="S2Aanalysisicon">
                            <img src="assets//media//S2A20.png">
                        </div>
                    </div>
                    <div class="S2noticerow S2subrow" id="S2Anoticerow">
                        <div class="S2noticeText" id="S2AnoticeText">
                            <p>請注意 : 為符合銀行法相關規定，請依下列注意事項辦理 :"<p>
                            <p>一、自用住宅放款或消費性放款，不得要求借款人提供連帶保證人；以取得足額擔保時，不得要求借款人提供保證人。</p>
                            <p>二、因自用住宅放款或消費性放款而爭取之保證人，其保證契約自成立之日起，有效期間不得逾十五年，但經保證人書面同意者，不在此限"</p>
                        </div>
                        <div class="S2notice" id="S2Anotice">
                            <img src="assets//media//S2A12.png">
                        </div>
                    </div>
                    
                </section>
                <section class="S2row scrollable-section" id="S2B">
                    <div class="S2subrow S2topic" id="S2Btopic">
                        <p>核貸委員審核紀錄</p>
                    </div>
                    <div class="S2subrow" id="S2Brow1">
                        <div class="S2B1item" id="S2B101">
                            <p class="S2B1title">實際簽核人員/單位</p>
                            <p class="S2B1content"></p>
                        </div>
                        <div class="S2B1item" id="S2B102">
                            <p class="S2B1title">簽核日期</p>
                            <p class=" S2B1content">2019/04/16 15:34</p>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Brow2">
                        <div class="S2B2colume">
                            <div class="S2B2item" id="S2B201">
                                <p class="S2B2title">簽核結果</p>
                                <div class="S2B2content">
                                    <img class="S2B2icon" src="assets//media//S2A09.png">
                                </div>
                            </div>
                            <div class="S2B2item" id="S2B202">
                                <p class="S2B2title">同意項目</p>
                                <p class="S2B2content S2B2text">核貸條件</p>
                            </div>
                            <div class="S2B2item" id="S2B203">
                                <p class="S2B2title">初始建議額度</p>
                                <p class="S2B2content S2B2text">123456</p>
                            </div>
                        </div>
                        <div class="S2B2colume">
                            <div class="S2B2item" id="S2B204">
                                <p class="S2B2title">審核意見</p>
                                <p class="S2B2content S2B2text">55555</p>
                            </div>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Brow3">
                        <div id="S2B3bigcolume1">
                            <div class="S2B3colume" id="S2B3colume1">
                                <div class="S2B3item" id="S2B301">
                                    <p class="S2B3title">貸款產品</p>
                                    <input class="S2B3text" type="text">
                                </div>
                                <div class="S2B3item" id="S2B302">
                                    <p class="S2B3title">提供保證人</p>
                                </div>
                                <div class="S2B3item" id="S2B303">
                                    <p class="S2B3title">總期數</p>
                                    <input class="S2B3text" type="text">
                                </div>
                            </div>
                            <div class="S2B3colume" id="S2B3colume2">
                                <div class="S2B3item" id="S2B304">
                                    <p class="S2B3title">金額</p>
                                    <input class="S2B3text" type="text">
                                </div>
                                <div class="S2B3item" id="S2B305">
                                    <p class="S2B3title">可使用額度</p>
                                    <input class="S2B3text" type="text">
                                </div>
                            </div>
                            <div class="S2noticeText" id="S2BnoticeText">
                            <p>請注意 : 為符合銀行法相關規定，請依下列注意事項辦理 :"<p>
                            <p>一、自用住宅放款或消費性放款，不得要求借款人提供連帶保證人；以取得足額擔保時，不得要求借款人提供保證人。</p>
                            <p>二、因自用住宅放款或消費性放款而爭取之保證人，其保證契約自成立之日起，有效期間不得逾十五年，但經保證人書面同意者，不在此限"</p>
                        </div>
                        </div>
                        <div id="S2B3bigcolume2">
                            
                            
                        <div class="S2notice" id="S2Bnotice">
                            <img src="assets//media//S2A12.png">
                        </div>
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Brow4">
                        <table border="1" class="tb-money table table-bordered dt-responsive nowrap">
                            <tr>
                                <th>+ A 放款利率</th>
                                <th colspan="3">- B 參考價格</th>
                                <th rowspan="2">= C 合理收益</th>
                                <th colspan="2">+ D 整體貢獻度說明</th>
                                <th colspan="4">= E 合理利潤</th>
                            </tr>
                            <tr>
                                <th>預定乘作利率(首年)</th>
                                <th>資金成本</th>
                                <th>營運成本</th>
                                <th>預期風險損失成本</th>
                                <th>手續費率</th>
                                <th>其他貢獻度</th>
                                <th>流動貼水</th>
                                <th>資本成本</th>
                                <th>其他</th>
                                <th>總利潤</th>
                            </tr>
                            <tr>
                                <td>8.95</td>
                                <td>0.534</td>
                                <td>0.271</td>
                                <td>0.271</td>
                                <td>5.805</td>
                                <td>1.143</td>
                                <td>0</td>
                                <td>0.312</td>
                                <td>0.638</td>
                                <td>5.998</td>
                                <td>6.948</td>
                            </tr>
                        </table>
                    </div>
                    <div class="S2subrow" id="S2Brow5">
                        <table border="1" class="tb-people table table-bordered dt-responsive nowrap">
                            <tr>
                                <th></th>
                                <th>姓名</th>
                                <th>單位</th>
                                <th>職稱</th>
                                <th>無擔金額(百萬)</th>
                                <th>授信合計(百萬)</th>
                                <th>本案無擔金額權限</th>
                                <th>本案金額權限</th>
                                <th>簽核日期</th>
                            </tr>
                            <tr>
                                <th>實際簽核</th>
                                <th>小藍</th>
                                <th>消金業務部</th>
                                <th>消金業務部推廣</th>
                                <th>(非核委)</th>
                                <th>企鵝</th>
                                <th rowspan="2">700000</th>
                                <th rowspan="2">700000</th>
                                <th rowspan="2">2019/04/22</th>
                            </tr>
                            <tr>
                                <td>簽核人員</td>
                                <td>小藍</td>
                                <td>消金業務部</td>
                                <td>消金業務部推廣</td>
                                <td>(非核委)</td>
                                <td>企鵝</td>
                            </tr>
                        </table>
                    </div>
                    <div class="S2subrow d-flex" id="S2Brow6">
                        <div class="S2B6colume flex-fill d-flex" id="S2B6colume2">
                            <div class="S2B6item1 flex-fill" id="S2B605">
                                <p class="S2B6title">風險性資產</p>
                                <p class="S2B6content S2B7number">522375</p>
                            </div>
                            <div class="S2B6item1 flex-fill" id="S2B607">
                                <p class="S2B6title">風險性資產比率</p>
                                <div class="S2B6icon">
                                <img class="S2B6icon2" src="assets//media//S2A13.png"></div>
                            </div>
                            <div class="S2B6item1 flex-fill" id="S2B608">
                                <p class="S2B6title">風險權數</p>
                                <div class="S2B6icon">
                                <img class="S2B6icon2" src="assets//media//S2A14.png"></div>
                            </div>
                        </div>
                        <div class="S2B6colume flex-fill d-flex" id="S2B6colume1">
                            <div class="S2B6item flex-fill" id="S2B601">
                                <p class="S2B6title">資金用途</p>
                                <p class="S2B6content S2B6text">家庭周轉金</p>
                            </div>
                            <div class="S2B6item flex-fill" id="S2B602">
                                <p class="S2B6title">風險定價</p>
                                <div class="S2B6icon">
                                <img class="S2B6icon1" src="assets//media//S2A09.png"></div>
                                
                            </div>
                                
                            
                            <div class="S2B6item flex-fill" id="S2B603">
                                <p class="S2B6title">風險定價期數</p>
                                <div class="S2B6icon">
                                <img class="S2B6icon1" src="assets//media//S2A10.png"></div>
                                
                            </div>
                                
                            
                            <div class="S2B6item flex-fill" id="S2B604">
                                <p class="S2B6title">建議額度</p>
                                <p class="S2B6content S2B6text">700000</p>
                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="S2subrow d-flex" id="S2Brow8">
                        <div class="S2B8section d-flex">
                            <div class="S2B8colume d-flex" id="S2B8colume1">
                                <div class="S2B8item" id="S2B801">
                                    <p class="S2B8title">貸款產品</p>
                                    <input class="S2B8content1 S2B8text" type="text">
                                </div>
                                <div class="S2B8item" id="S2B802">
                                    <p class="S2B8title">連保</p>
                                    
                                        <input type="checkbox" class="S2B8checkbox">
                                    
                                    <p class="S2B8title">一般</p>    
                                    <input type="checkbox" class="S2B8checkbox">
                                </div>
                            </div>
                            <div class="S2B8colume d-flex" id="S2B8colume3">
                                <div class="S2B8item" id="S2B803">
                                    <p class="S2B8title">金額</p>
                                    <input class="S2B8content S2B8text" type="text">
                                </div>
                                <div class="S2B8item" id="S2B804">
                                    <p class="S2B8title">可使用額度</p>
                                    <input class="S2B8content S2B8text" type="text">
                                </div>
                            </div>
                            <div class="S2B8colume d-flex flex-nowrap" id="S2B8colume4">
                                <div class="S2B8item" id="S2B805">
                                    <p class="S2B8title">總期數</p>
                                    <input class="S2B8content S2B8text" type="text">
                                </div>
                                <div class="S2B8item" id="S2B806">
                                    <p class="S2B8title">展期次數</p>
                                    <input class="S2B8content S2B8text" type="text">
                                </div>
                                <div class="S2B8item" id="S2B807">
                                    <p class="S2B8title">利率</p>
                                    <input class="S2B8content S2B8text" type="text">
                                </div>
                        
                            </div>

                        </div>
                        <div class="S2B8section1 d-flex flex-fill">
                            <table border="1" class="tb-S2B8section1 table table-bordered dt-responsive nowrap">
                            <tr>
                                <th><p>案件送簽性質</p><p>簽核</p></th>
                                <th><p>簽核結果</p>
                                <img class="S2B81icon" src="assets//media//S2A09.png"></th>
                                <th><p>同意項目</p><p>核貸條件</p></th>
                                <th><p>是否為最高核委</p>
                                <img class="S2B81icon" src="assets//media//S2A10.png"></th>
                                <th><p>調整核貸金額原因</p><p>ss</p></th>
                                <th><p>審核意見</p><p>ddd</p></th>
                                
                            </tr>
                            
                        </table>
                        </div>
                        <div class="S2B8section2 d-flex flex-fill">
                            <table border="1" class="tb-S2B8section2 table table-bordered dt-responsive nowrap">
                            <tr>
                                <th><p>第</p><input type="text">
                                <p>期起</p></th>
                                <th><p>利率</p>
                                <p>機動</p></th>
                                <th><p>105個金放款/房貸指標(月)+7.89%</p></th>
                                <th><p>目前利率</p>
                                <p>9%</p></th>
                            </tr>
                            
                        </table>
                        </div>
                        
                    </div>
                    <div class="S2subrow" id="S2Brow9">
                        
                        <div class="S2B9colume" id="S2B9columne1">
                            <p class="S2B9title">說明</p>
                            <div id="prompt">
                                <img id="S2set" src="assets//media//S2A17.png">
                            </div>
                        </div>

                        <div class="S2B9columne" id="S2B9columne2">
                            <textarea class="S2B9text" id="S2tags" cols="50" rows="4"></textarea>
                        </div>
                    </div>
                </section>
                <section class="S2row scrollable-section" id="S2C">
                    <div id="S2Ccolume1"></div>
                    <div id="S2Ccolume2"></div>
                    <div id="S2Ccolume3"></div>
                    <div id="S2Ccolume4"></div>
                </section>
                <section class="S2row scrollable-section" id="S2D">
                    <div class="S2subrow S2topic" id="S2Dtopic">
                        <p>核委意見</p>
                    </div>
                    <div class="S2subrow" id="S2Drow1">
                        <table border="1" class="tb-money table table-bordered dt-responsive nowrap">
                            <tr>
                                <th rowspan="2">關係人姓名</th>
                                <th rowspan="2">ID</th>
                                <th colspan="4">Score 13 評分模組</th>
                                <th colspan="3">Score 17 評分模</th>
                                <th rowspan="2">J10信用評分</th>
                                <th rowspan="2">信用等級</th>
                            </tr>
                            <tr>
                                <th>卡別</th>
                                <th>Score 13</th>
                                <th>Risk Grade</th>
                                <th>風險區隔</th>
                                <th>Score 17</th>
                                <th>Risk Grade</th>
                                <th>風險客群</th>
                            </tr>
                            <tr>
                                <td>何核核</td>
                                <td>LGG</td>
                                <td>卡一</td>
                                <td>443</td>
                                <td>6</td>
                                <td>高風險</td>
                                <td>413</td>
                                <td>7</td>
                                <td>D</td>
                                <td>499</td>
                                <td>A</td>
                            </tr>
                        </table>
                    </div>
                    <div class="S2subrow" id="S2Drow2">
                        <table border="1" class="tb-people table table-bordered dt-responsive nowrap">
                            <tr>
                                <th></th>
                                <th>姓名</th>
                                <th>單位</th>
                                <th>職稱</th>
                                <th>無擔金額(百萬)</th>
                                <th>授信合計(百萬)</th>
                                <th>本案無擔金額權限</th>
                                <th>本案金額權限</th>
                                <th>簽核日期</th>
                            </tr>
                            <tr>
                                <th>實際簽核</th>
                                <th>小藍</th>
                                <th>消金業務部</th>
                                <th>消金業務部推廣</th>
                                <th>(非核委)</th>
                                <th>企鵝</th>
                                <th rowspan="2">700000</th>
                                <th rowspan="2">700000</th>
                                <th rowspan="2">2019/04/22</th>
                            </tr>
                            <tr>
                                <td>簽核人員</td>
                                <td>小藍</td>
                                <td>消金業務部</td>
                                <td>消金業務部推廣</td>
                                <td>(非核委)</td>
                                <td>企鵝</td>
                            </tr>
                        </table>
                    </div>
                    <div class="S2subrow" id="S2Drow3">
                        <div class="S2D3colume" id="S2D3colume1">
                            <div class="S2D3item2" id="S2D301">
                                <p class="S2D3title">借貸人月收入</p><input class="S2D3text" type="text">
                            </div>
                            <div class="S2D3item2" id="S2D302">
                                <p class="S2D3title">建議額度</p><input class="S2D3text" type="text">
                            </div>
                        </div>
                        <div class="S2D3colume" id="S2D3colume2">
                            <div class="S2D3item2" id="S2D303">
                                <p class="S2D3title">本次核貸金額加計無擔外債為月收入金額約</p><input class="S2D3text" type="text">
                                <p class="S2D3unit">倍</p>
                            </div>
                            <div class="S2D3item2" id="S2D304">
                                <p class="S2D3title">全體金融機構之無擔飽受信總餘額(含本次)為年所得之</p><input class="S2D3text" type="text">
                                <p class="S2D3unit">%</p>
                            </div>
                        </div>
                        <div class="S2D3colume" id="S2D3colume3">
                            <div class="S2D3item2" id="S2D305">
                                <p class="S2D3title">本次貸款支出調整為</p><input class="S2D3text" type="text">
                            </div>
                            <div class="S2D3item2" id="S2D306">
                                <p class="S2D3title">致當月結餘金額為</p><input class="S2D3text" type="text">
                            </div>
                        </div>
                        <div class="S2D3colume" id="S2D3colume4">
                            <div class="S2D3item3" id="S2D307">
                                <p class="S2D3title">本次貸款支出/總月收入</p><input class="S2D3text" type="text">
                                <p class="S2D3unit">%</p>
                            </div>
                            <div class="S2D3item3" id="S2D308">
                                <p class="S2D3title">總貸款支出/總月收入</p><input class="S2D3text" type="text">
                                <p class="S2D3unit">%</p>
                            </div>
                            <div class="S2D3item3" id="S2D309">
                                <p class="S2D3title">總月支出/總月收入</p><input class="S2D3text" type="text">
                                <p class="S2D3unit">%</p>
                            </div>
                        </div>
                    </div>
                    <div class="S2noticerow S2subrow" id="S2Dnoticerow">
                        <div class="S2noticeText" id="S2DnoticeText">
                            <div class="S2subrow" id="S2Drow3-5">
                                <div class="S2D3section" id="S2D310">
                                    <p class="S2D3title">案件送簽性質</p>
                                    <p class="S2D3content S2D3text">簽核</p>
                                </div>
                                <div class="S2D3section" id="S2D311">
                                    <p class="S2D3content S2D3text">本案經評分卡核准，需經一位適當層級授信人員簽核</p>
                                </div>
                            </div>
                        </div>
                        <div class="S2notice" id="S2Dnotice">
                            <img src="assets//media//S2A12.png">
                        </div>
                    </div>
                    <div class="S2subrow" id="S2Drow4">
                        <div id="S2D4section1"></div>
                        <div class="S2tab">
                            <button class="tablinks" onclick="creatProduct(event, 'FirstProduct')">01</button> <button class="tablinks" onclick="creatProduct(event, 'SecondProduct')">02</button> <button class="tablinks" onclick="creatProduct(event, 'ThirdProduct')">03</button>
                        </div>
                        <div class="S2tabcontent" id="FirstProduct">
                            <div class="S2D4section2" id="S2D4section2-1">
                                <div class="S2D42colume S2D42colume1" id="S2D42colume1-1">
                                    <p class="S2D42title">貸款產品</p>
                                    <select name="請選擇">
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                            </select>
                                </div>
                                <div class="S2D42colume S2D42colume2" id="S2D42colume2-1">
                                    <p class="S2D42title">連保</p>
                                </div>
                                <div class="S2D42colume S2D42colume3" id="S2D42colume3-1">
                                    <p class="S2D42title">一般</p>
                                </div>
                                <div class="S2D42colume S2D42colume4" id="S2D42colume4-1">
                                    <p class="S2D42title">金額</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume5" id="S2D42colume5-1">
                                    <p class="S2D42title">可使用額度</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume6" id="S2D42colume6-1">
                                    <p class="S2D42title">總期數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume7" id="S2D42colume7-1">
                                    <p class="S2D42title">展期次數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume8" id="S2D42colume8-1">
                                    <p class="S2D42title">利率</p>
                                    <p class="S2D42content S2D42text"></p>
                                </div>
                            </div>
                            <div class="S2D4section3" id="S2D4section3-1">
                                <div class="S2D43colume S2D43colume1" id="S2D43colume1-1">
                                    <p class="S2D43">計算風險定價</p>
                                    <p class="S2D43">計算全案收益</p>
                                </div>
                                <div class="S2D43colume S2D43colume2" id="S2D43colume2-1">
                                    <p class="S2D43"></p>
                                    <p class="S2D43"></p>
                                </div>
                                <div class="S2D43colume S2D43colume3" id="S2D43colume3-1">
                                    <p class="S2D4325">資金用途別</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險定價</p>
                                    <p class="S2D4325">風險定價期數</p>
                                    <select class="S2D4350 S2D43select" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                </div>
                                <div class="S2D43colume S2D43colume4" id="S2D43colume4-1">
                                    <p class="S2D4325">還款方式</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險權數</p>
                                    <p class="S2D4375">%</p>
                                </div>
                                <div class="S2D43colume S2D43colume5" id="S2D43colume5-1">
                                    <p class="S2D4350">先收息期數</p><input class="S2D4350" type="text">
                                    <p class="S2D43"></p>
                                </div>
                                <table border="1" class="tb-product table table-nonbordered dt-responsive nowrap S2D4section4" id="S2D4section4-1">
                                    <tr>
                                        <th>
                                            <p>第</p>
                                            <input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="S2tabcontent" id="SecondProduct">
                            <div class="S2D4section2" id="S2D4section2-2">
                                <div class="S2D42colume S2D42colume1" id="S2D42colume1-2">
                                    <p class="S2D42title">貸款產品</p>
                                    <select name="請選擇">
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                            </select>
                                </div>
                                <div class="S2D42colume S2D42colume2" id="S2D42colume2-2">
                                    <p class="S2D42title">連保</p>
                                </div>
                                <div class="S2D42colume S2D42colume3" id="S2D42colume3-2">
                                    <p class="S2D42title">一般</p>
                                </div>
                                <div class="S2D42colume S2D42colume4" id="S2D42colume4-2">
                                    <p class="S2D42title">金額</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume5" id="S2D42colume5-2">
                                    <p class="S2D42title">可使用額度</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume6" id="S2D42colume6-2">
                                    <p class="S2D42title">總期數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume7" id="S2D42colume7-2">
                                    <p class="S2D42title">展期次數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume8" id="S2D42colume8-2">
                                    <p class="S2D42title">利率</p>
                                    <p class="S2D42content S2D42text"></p>
                                </div>
                            </div>
                            <div class="S2D4section3" id="S2D4section3-2">
                                <div class="S2D43colume S2D43colume1" id="S2D43colume1-2">
                                    <p class="S2D43">計算風險定價</p>
                                    <p class="S2D43">計算全案收益</p>
                                </div>
                                <div class="S2D43colume S2D43colume2" id="S2D43colume2-2">
                                    <p class="S2D43"></p>
                                    <p class="S2D43"></p>
                                </div>
                                <div class="S2D43colume S2D43colume3" id="S2D43colume3-2">
                                    <p class="S2D4325">資金用途別</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險定價</p>
                                    <p class="S2D4325">風險定價期數</p>
                                    <select class="S2D4350 S2D43select" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                </div>
                                <div class="S2D43colume S2D43colume4" id="S2D43colume4-2">
                                    <p class="S2D4325">還款方式</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險權數</p>
                                    <p class="S2D4375">%</p>
                                </div>
                                <div class="S2D43colume S2D43colume5" id="S2D43colume5-2">
                                    <p class="S2D4350">先收息期數</p><input class="S2D4350" type="text">
                                    <p class="S2D43"></p>
                                </div>
                                <table border="1" class="tb-product table table-nonbordered dt-responsive nowrap S2D4section4" id="S2D4section4-2">
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div class="S2tabcontent" id="ThirdProduct">
                            <div class="S2D4section2" id="S2D4section2-3">
                                <div class="S2D42colume S2D42colume1" id="S2D42colume1-3">
                                    <p class="S2D42title">貸款產品</p>
                                    <select name="請選擇">
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                                <option value="1">
                                                    1
                                                </option>
                                            </select>
                                </div>
                                <div class="S2D42colume S2D42colume2" id="S2D42colume2-3">
                                    <p class="S2D42title">連保</p>
                                </div>
                                <div class="S2D42colume S2D42colume3" id="S2D42colume3-3">
                                    <p class="S2D42title">一般</p>
                                </div>
                                <div class="S2D42colume S2D42colume4" id="S2D42colume4-3">
                                    <p class="S2D42title">金額</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume5" id="S2D42colume5-3">
                                    <p class="S2D42title">可使用額度</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume6" id="S2D42colume6-3">
                                    <p class="S2D42title">總期數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume7" id="S2D42colume7-3">
                                    <p class="S2D42title">展期次數</p><input class="S2D42text" type="text">
                                </div>
                                <div class="S2D42colume S2D42colume8" id="S2D42colume8-3">
                                    <p class="S2D42title">利率</p>
                                    <p class="S2D42content S2D42text"></p>
                                </div>
                            </div>
                            <div class="S2D4section3" id="S2D4section3-3">
                                <div class="S2D43colume S2D43colume1" id="S2D43colume1-3">
                                    <p class="S2D43">計算風險定價</p>
                                    <p class="S2D43">計算全案收益</p>
                                </div>
                                <div class="S2D43colume S2D43colume2" id="S2D43colume2-3">
                                    <p class="S2D43"></p>
                                    <p class="S2D43"></p>
                                </div>
                                <div class="S2D43colume S2D43colume3" id="S2D43colume3-3">
                                    <p class="S2D4325">資金用途別</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險定價</p>
                                    <p class="S2D4325">風險定價期數</p>
                                    <select class="S2D4350 S2D43select" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                </div>
                                <div class="S2D43colume S2D43colume4" id="S2D43colume4-3">
                                    <p class="S2D4325">還款方式</p>
                                    <select class="S2D4375 S2D43select1" name="請選擇">
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                            <option value="1">
                                                1
                                            </option>
                                        </select>
                                    <p class="S2D4325">風險權數</p>
                                    <p class="S2D4375">%</p>
                                </div>
                                <div class="S2D43colume S2D43colume5" id="S2D43colume5-3">
                                    <p class="S2D4350">先收息期數</p><input class="S2D4350" type="text">
                                    <p class="S2D43"></p>
                                </div>
                                <table border="1" class="tb-product table table-nonbordered dt-responsive nowrap S2D4section4" id="S2D4section4-3">
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <p>第</p><input class="S2D42text" type="text">
                                            <p>期起</p>
                                        </th>
                                        <th>固定</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>機動</th>
                                        <th><select class="S2D42select" name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th><select name="請選擇">
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                    <option value="1">
                                                        1
                                                    </option>
                                                </select></th>
                                        <th>
                                            <input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                        <th>
                                            <p>目前利率</p><input class="S2D42text" type="text">
                                            <p>%</p>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
       
    
                </section>


            </div>




        </div>
    </div>
`;


        $content.html(newContentHtml);
    } else if (page == 'loan') {
        // 核貸書
        const newContentHtml = `              <div id="Doc-Loan" class="doc-loan">
        <div class="indexBar">
            <div class="indexTitle">
                <p class="first-word"> 核貸書 </p>
            </div>

            <div class="index ">
                <a class="index-word in-apply" href="#Main"> 大綱 </a>
                </br>
                <a class="index-word in-record" href="#ln-part-1"> 借貸資訊</a>
                </br>
                <a class="index-word in-opinion" href="#ln-part-2"> 借貸人背景 </a>
                </br>
                <a class="index-word in-reply" href="#ln-part-3"> 案件批覆 </a>
            </div>
        </div>
        <div class="content">
            <div class="docTitle">
                <h1>核 貸 書</h1>
            </div>

            <div id="Main" class="lnPart">
                <div class="ln-partTitle">
                    <img class="ln-shrink shrink0 minus0" src="assets/media/minus.png" alt="">
                    <img class="ln-shrink shrink0 plus0 off" src="assets/media/plus.png" alt="">
                    <p style="display:inline-block">核貸書大綱</p>
                </div>

                <div id="lnPartMainContent">

                    <div id="MainCard-1" class="manyCards d-flex flex-wrap">
                        <div class="cardItem cardcontainer flex-fill padding-2">
                            <div class="cardTitle-main">
                                <a href="#p3-2">
                                    <p>簽核結果 : </p>
                                </a>
                            </div>
                            <div class="cardWord-main lnCard-icon">
                                <img src="assets/media/S2A09.png" alt="">
                            </div>
                        </div>

                        <div class="cardItem cardcontainer flex-fill padding-2">
                            <div class="cardTitle-main ">
                                <a href="#ln-part-1">
                                    <p>用途別 : </p>
                                </a>
                            </div>
                            <div class="cardWord-main cd">
                                <div class="cardWord-main lnCard-icon-family">
                                    <img src="assets/media/family.png" alt="">
                                </div>
                                <div class="family-word">

                                    <p class="cdfamilyWord">家庭週轉金 </p>

                                </div>
                            </div>
                        </div>

                        <div class="cardItem  cardcontainer flex-fill padding-2">
                            <div class="cardTitle-main">
                                <a href="#p3-2">
                                    <p>建議額度 / 申貸總金額 : </p>
                                </a>
                            </div>
                            <div class="cardWord-main cd">
                                <p class="cdbigWord" style="display:inline-block"> NT $ 60000 </p>
                                <p style="display:inline-block"> / NT $ 190000 </p>
                            </div>
                        </div>
                    </div>

                    <div id="MainCard-2">
                        <div class="d-flex">
                            <div class="d-flex flex-fill main-money flex-wrap">
                                <div class="cardItem sm-card flex-fill">
                                    <div class="bg-gray-1">
                                        <a href="#lnSummary">
                                            <p>月收入</p>
                                        </a>
                                    </div>
                                    <div class="exp-icon">
                                        <p>NT $ 30,897</p>
                                        <!-- <img src="assets/media/exp3.png" alt=""> -->
                                    </div>
                                </div>
                                <div class="cardItem sm-card flex-fill">
                                    <div class="bg-gray-1">
                                        <a href="#lnSummary">
                                            <p>月支出</p>
                                        </a>
                                    </div>
                                    <div class="exp-icon">
                                        <p>NT $ 27,880</p>
                                        <!-- <img src="assets/media/exp3.png" alt=""> -->
                                    </div>
                                </div>
                            </div>
                            <div class="cardItem sm-card flex-fill">
                                <div class="bg-white">
                                    <a href="#lnSummary">
                                        <p>本次貸款支出/總月收入</p>
                                    </a>
                                </div>
                                <!-- <div class="cardTitle-main ">
                                                    <p>本次貸款支出/總月收入 </p>
                                                </div> -->
                                <div class="exp-icon">
                                    <img src="assets/media/exp1.png" alt="">
                                </div>
                            </div>

                            <div class="cardItem sm-card flex-fill">
                                <div class="bg-white">
                                    <a href="#lnSummary">
                                        <p>總貸款支出/總月收入</p>
                                    </a>
                                </div>
                                <!-- <div class="cardTitle-main ">
                                                    <p>總貸款支出/總月收入</p>
                                                    <p> (負債比) </p>
                                                </div> -->
                                <div class="exp-icon">
                                    <img src="assets/media/exp2.png" alt="">
                                </div>
                            </div>
                            <div class="cardItem sm-card flex-fill">
                                <div class="bg-white">
                                    <a href="#lnSummary">
                                        <p>總月支出/總月收入</p>
                                    </a>
                                </div>
                                <!-- <div class="cardTitle-main ">
                                                    <p>總月支出/總月收入</p>
                                                </div> -->

                                <div class="exp-icon">
                                    <img src="assets/media/exp3.png" alt="">
                                </div>
                            </div>
                            <div class="cardItem sm-card flex-fill">
                                <div class="bg-white">
                                    <a href="#ln-part-1">
                                        <p>風險權數</p>
                                    </a>
                                </div>
                                <!-- <div class="cardTitle-main ">
                                                        <p>總月支出/總月收入</p>
                                                    </div> -->

                                <div class="exp-icon">
                                    <div class="exp-p">
                                        <p>75</p>
                                    </div>
                                    <!-- <img src="assets/media/exp3.png" alt=""> -->
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

            <div id="ln-part-1" class="lnPart">
                <div class="ln-partTitle">
                    <img class="ln-shrink shrink1 minus1" src="assets/media/minus.png" alt="">
                    <img class="ln-shrink shrink1 plus1 off" src="assets/media/plus.png" alt="">
                    <!-- <p class="ln-shrink shrink1 plus">+</p> -->
                    <!-- <p class="ln-shrink shrink1 minus">-</p> -->
                    <p style="display:inline-block">Part 1 - 借貸資訊</p>
                </div>
                <div id="lnPart1Content">
                    <div class="flexContainer nowrap" id="lnPart1Content">
                        <div class="loanTextbox">
                            <p class="lnBox-title">主要借款人 : </p>
                            <div class="name" style="display:inline-block">
                                <p> 王大明 </p>
                            </div>
                            <div class="lnBox-discription" style="display:inline-block">
                                <p> ( ID:H123456789 )</p>
                            </div>
                            <p class="lnBox-title" style="margin-top:0.7rem">分行及駐點地區地緣 :</p>
                            <div class="lnBox-discription">
                                <p> 是，說明 : AO台新舊戶</p>
                            </div>
                        </div>
                        <div class="loanTextbox">
                            <p class="lnBox-title">貸款產品 :</p>
                            <div class="lnBox-discription">
                                <p> 專案種類 : 106消金DS優質信貸</p>
                                <p> 產品名稱 : 42信用貸款(1)</p>
                            </div>
                            <!-- <p class="lnBox-title">分行及駐點地區地緣</p> -->
                        </div>
                        <div class="loanTextbox">
                            <p class="lnBox-title">業務來源 :</p>
                            <div class="lnBox-discription">
                                <p> 借貸人自行前來借貸</p>

                            </div>
                        </div>
                    </div>

                    <div class="gradientDiv" id="lnMoney">
                        <p class="lnBox-title">貸款總金額 :</p>
                        <div class="lnBox-discription">
                            <p> NT $ 1,900,000</p>
                        </div>
                        <p class="lnBox-title">初始建議額度 :</p>
                        <div class="lnBox-discription">
                            <p> NT $ 60,000</p>
                        </div>
                    </div>

                    <div class="manyCards d-flex flex-wrap justify-content-center">

                        <div class="cardItem padding-2   width17rem ">
                            <div class="cardTitle">
                                <p>產品名稱 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 42 信用貸款 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>還款方式 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 平均攤還本息 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>繳款方式 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 自動扣款 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>資金用途別 : </p>
                            </div>
                            <div class="cardWord">
                                <p>家庭週轉金 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>風險定價 : </p>
                            </div>
                            <div class="cardWord">
                                <img src="assets/media/S2A09.png" alt="">
                                <!-- <p> *勾勾勾 </p> -->
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>利率 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 1 - 84 期 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>申貸金額 : </p>
                            </div>
                            <div class="cardWord">
                                <p>NT $ 19,000,000 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>先收息期數 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 無 </p>
                            </div>
                        </div>

                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>風險權數 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 75 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>風險定價期數 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 優質客戶一段式 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>總期數 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 84 期 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>利率 : </p>
                            </div>
                            <div class="cardWord">
                                <p> 105個金放款/房貸指標(月)+3.09%，機動 </p>
                            </div>
                        </div>

                        <div class="cardItem padding-2   width17rem">

                            <div class="cardTitle">
                                <p>保證人提供 : </p>
                            </div>
                            <div class="cardWord">
                                <img src="assets/media/S2A10.png" alt="">

                            </div>

                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>風險性資產 : </p>
                            </div>
                            <div class="cardWord">
                                <p>NT $ 1,14465456 </p>
                            </div>
                        </div>
                        <div class="cardItem padding-2   width17rem">
                            <div class="cardTitle">
                                <p>月付金/月付息 : </p>
                            </div>
                            <div class="cardWord">
                                <p> NT $ 36104 </p>
                            </div>
                        </div>

                    </div>
                    <!-- <table id="example" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Extn.</th>
                        <th>Start date</th>
                        <th>Salary</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Extn.</th>
                        <th>Start date</th>
                        <th>Salary</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th colspan="5">休息時間</th>
                        <th></th>
                    </tr>

                </thead>

            </table> -->
                    <div class="tb-container">
                        <table class="tb-money table table-bordered  dt-responsive nowrap" border="1">
                            <tr>
                                <th>A 放款利率</th>
                                <th colspan="3">- B 參考價格</th>
                                <th rowspan="2">= C 合理收益</th>
                                <th colspan="2">+ D 整體貢獻度說明</th>
                                <th colspan="4">= E 合理利潤</th>
                            </tr>
                            <tr>
                                <th>預定乘作利率(首年)</th>
                                <th>資金成本</th>
                                <th>營運成本</th>
                                <th>預期風險損失成本</th>
                                <th>手續費率</th>
                                <th>其他貢獻度</th>
                                <th>流動貼水</th>
                                <th>資本成本</th>
                                <th>其他</th>
                                <th>總利潤</th>
                            </tr>
                            <tr>
                                <td>8.95</td>
                                <td>0.534</td>
                                <td>0.271</td>
                                <td>0.271</td>
                                <td>5.805</td>
                                <td>1.143</td>
                                <td>0</td>
                                <td>0.312</td>
                                <td>0.638</td>
                                <td>5.998</td>
                                <td>6.948</td>
                            </tr>
                        </table>
                    </div>

                    <div class="tb-container">
                        <table class="tb-money2 table table-bordered dt-responsive nowrap" border="1">
                            <tr>
                                <th>風險性資產</th>
                                <td>NT $ 70000</td>
                                <th>風險性資產比率</th>
                                <td>74.6%</td>
                            </tr>

                        </table>
                    </div>


                </div>
            </div>
            <div id="ln-part-2" class="lnPart">
                <div class="ln-partTitle">
                    <img class="ln-shrink shrink2 minus2 " src="assets/media/minus.png" alt="">
                    <img class="ln-shrink shrink2 plus2 off" src="assets/media/plus.png" alt="">

                    <!-- <p class="ln-shrink shrink2">+</p> -->
                    <p style="display:inline-block">Part 2 - 借貸人背景</p>
                </div>
                <div id="lnPart2Content">
                    <div class="flexContainer nowrap">

                        <div class="loanTextbox flex-fill ">
                            <p class="lnBox-title">總收入及比率</p>
                            <div class="lnBox-discription">
                                <p> 年收入 : NT$ 1,463,316</p>
                                <p> 收入資料憑證:</p>
                            </div>
                        </div>


                        <!-- .cardItem-->



                    </div>
                    <div class="flexContainer">
                        <div class="flex-fill">
                            <p class="lnBox-title">還款來源分析</p>
                            <!-- <div class="ln-repayment"> -->
                            <div id="lnSummary">

                                <div class="ln-summary">
                                    <div class="ln-summary-word d-flex justify-content-around">
                                        <div class="width33">
                                            <p>總結餘 : $3008</p>
                                        </div>
                                        <div class="width33">
                                            <p>總月收入 : $30,897</p>
                                        </div>
                                        <div class="width33">
                                            <p>總支出 : $27,880</p>
                                        </div>
                                    </div>
                                    <!-- <img src="assets/media/ln-bar.png"> -->
                                </div>

                            </div>

                            <div class="ln-repayment row">
                                <div class="income col no-padding">
                                    <div class="row">
                                        <div class='cardItem col mainCard-1'>
                                            <p>主借款人</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="cardItem sm-card loanTextBox col">
                                            <div class="bg-gray">
                                                <p>現金卡+信用卡餘額</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 11,419</p>
                                            </div>
                                        </div>


                                        <div class="cardItem sm-card loanTextBox col">
                                            <div class="bg-gray">
                                                <p>其他無擔放款餘額</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 0</p>
                                            </div>
                                        </div>
                                        <div class="cardItem sm-card loanTextBox col">
                                            <div class="bg-gray">
                                                <p>無擔保貸款合計</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 11,419</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="cardItem sm-card  col">
                                            <p class="bg-gray">應計入DBR22倍規範之無擔保放款餘額</p>
                                            <div class="ln-dollor">
                                                <p>NT $ 11,951</p>
                                            </div>
                                        </div>
                                        <div class="cardItem sm-card col">
                                            <div class="bg-gray">
                                                <p>本行無擔總放款金額</p>
                                                <p>(含本次)</p>
                                            </div>

                                            <div class="ln-dollor">
                                                <p>NT $ 700,000</p>
                                            </div>

                                        </div>
                                        <div class="cardItem sm-card col">
                                            <div class="bg-gray">
                                                <p>本行之總貸款金額</p>
                                                <p>(含本次)</p>

                                            </div>

                                            <div class="ln-dollor">
                                                <p>NT $ 700,000</p>
                                            </div>
                                        </div>
                                        <div class="cardItem sm-card col">
                                            <div class="bg-gray">
                                                <p>金融機構總貸款總額</p>
                                                <p>(含本次)</p>

                                            </div>

                                            <div class="ln-dollor">
                                                <p>NT $ 711419</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class='pay col no-padding'>
                                    <div class="d-flex">
                                        <div class='cardItem flex-fill mainCard-2'>
                                            <p>每月支出</p>
                                        </div>
                                    </div>

                                    <div class="d-flex">

                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>個人支出</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 26,000</p>
                                            </div>

                                        </div>
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>租金支出</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 0</p>
                                            </div>

                                        </div>
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>本金貸款支出</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 26,102</p>
                                            </div>

                                        </div>
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>其他貸款支出</p>
                                            </div>
                                            <div class="ln-dollor">
                                                <p>NT $ 64,876</p>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>本次貸款支出/總月收入</p>
                                            </div>
                                            <!-- <div class="cardTitle-main ">
                                            <p>本次貸款支出/總月收入 </p>
                                        </div> -->
                                            <div class="exp-icon">
                                                <img src="assets/media/exp1.png" alt="">
                                            </div>
                                        </div>
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>總貸款支出/總月收入</p>
                                            </div>

                                            <div class="exp-icon">
                                                <img src="assets/media/exp2.png" alt="">
                                            </div>
                                        </div>
                                        <div class="cardItem sm-card flex-fill">
                                            <div class="bg-gray">
                                                <p>總月支出/總月收入</p>
                                            </div>


                                            <div class="exp-icon">
                                                <img src="assets/media/exp3.png" alt="">
                                            </div>
                                        </div>

                                    </div>
                                </div>



                            </div>



                        </div>

                    </div>


                    <!-- 核貸最後一個方塊 -->




                </div>
            </div>
            <div id="ln-part-3" class="lnPart">
                <div class="ln-partTitle">
                    <img class="ln-shrink shrink3 minus3 " src="assets/media/minus.png" alt="">
                    <img class="ln-shrink shrink3 plus3 off" src="assets/media/plus.png" alt="">

                    <!-- <p class="ln-shrink shrink2">+</p> -->
                    <p style="display:inline-block">Part 3 - 案件批覆</p>
                </div>


                <div id="lnPart3Content">
                    <div id="lnP3-improve">
                        <div class="d-flex P2row1">
                            <div class="cardItem-2 padding-2-2 bg-yellow flex-fill">
                                <div class="cardTitle-2">
                                    <p>借款人月收入 : </p>
                                </div>
                                <div class="cdP2-word padding-2">
                                    <p class="">NT $ 30897 </p>
                                </div>
                            </div>
                            <div class="cardItem-2 padding-2-2 bg-yellow flex-fill">
                                <div class="cardTitle-2">
                                    <p>本次核貸金額家計無擔外債為收金額之 </p>
                                </div>
                                <div class="cdP2-word padding-2">
                                    <p class="" style="color:rgb(202, 26, 26)">13.33 倍</p>
                                </div>
                            </div>
                            <div class="cardItem-2 padding-2-2 bg-yellow flex-fill">
                                <div class="cardTitle-2">
                                    <p>全體金融機構之無擔保授信總餘額為收入之 </p>
                                </div>
                                <div class="cdP2-word padding-2">
                                    <p class="" style="color:rgb(202, 26, 26)"> 111.11% </p>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex P2row2">
                            <div class="cardItem-2 padding-2-2 bg-yellow flex-fill">
                                <div class="cardTitle-2">
                                    <p>本次貸款支出調整為 : </p>
                                </div>
                                <div class="cdP2-word padding-2">
                                    <p class="" style="color:rgb(9, 33, 113);">NT $ 6141 </p>
                                </div>
                            </div>
                            <div class="cardItem-2 padding-2-2 bg-yellow flex-fill">
                                <div class="cardTitle-2">
                                    <p>致當月結餘金額為 </p>
                                </div>
                                <div class="cdP2-word padding-2">
                                    <p class="" style="color:rgb(9, 33, 113);"> NT $ 7614 </p>
                                </div>
                            </div>
                        </div>
                        <div id="ln-improve-pic" class="d-flex P2row3">

                            <div class="ln-improve">
                                <div class="ln-summary-word d-flex justify-content-around">
                                    <div class="width33">
                                        <p>本次貸款支出/總月收入</p>
                                        <div class="exp-icon">
                                            <img src="assets/media/improve-1.png" alt="">
                                        </div>
                                    </div>

                                    <div class="width33">
                                        <p>總貸款支出/總月收入</p>
                                        <div class="exp-icon">
                                            <img src="assets/media/improve-2.png" alt="">
                                        </div>
                                    </div>
                                    <div class="width33">
                                        <p>總月支出/總月收入</p>
                                        <div class="exp-icon">
                                            <img src="assets/media/improve-3.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <!-- <img src="assets/media/ln-bar.png"> -->
                            </div>

                        </div>
                    </div>

                    <div class="P3-1">
                        <div class="flexContainer">

                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">專案批覆原因</p>
                                <div class="lnBox-discription">
                                    <p> 申覆、收支比超過規定</p>
                                </div>
                            </div>
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">文件需求</p>
                                <div class="lnBox-discription">
                                    <p> 所得證明文件、身分證明文件、代償還款證明文件</p>
                                </div>
                            </div>
                        </div>
                        <div class="flexContainer">
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">費用減免</p>
                                <div class="lnBox-discription">
                                    <p>帳務管理費減免為NT$1000元</p>
                                </div>
                            </div>
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">提前違約金條款</p>
                                <div class="lnBox-discription">
                                    <p>有，結清/還本(當日本金)</p>
                                </div>
                            </div>
                        </div>
                        <div class="flexContainer">
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">本行利害關係人註記</p>

                            </div>
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">利害關係人授信檢核表</p>

                            </div>
                        </div>
                        <div class="flexContainer">
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">業務人員說明</p>
                                <div class="lnBox-discription">
                                    <p>申請書月收入: NT $ 125,506</p>
                                    <p> 區/總行核貸原因: 無</p>
                                </div>
                            </div>


                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">核貸委員意見</p>
                                <div class="lnBox-discription">
                                    <p>本案經評分卡核准，需經一位適當層級授信人員簽核。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="P3-2" id="p3-2">
                        <div class="manyCards d-flex flex-wrap justify-content-center">

                            <div class="cardItem padding-2 flex-fill ">
                                <div class="cardTitle">
                                    <p>簽核結果 : </p>
                                </div>
                                <div class="cardWord">
                                    <img src="assets/media/S2A09.png" alt="">

                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill  ">
                                <div class="cardTitle">
                                    <p>同意項目 : </p>
                                </div>
                                <div class="cardWord">
                                    <p> 核貸條件 </p>
                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill">
                                <div class="cardTitle">
                                    <p>審核意見: </p>
                                </div>
                                <div class="cardWord">
                                    <p> 無 </p>
                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill  ">
                                <div class="cardTitle">
                                    <p>初始建議額度: </p>
                                </div>
                                <div class="cardWord">
                                    <p style="font-size:25px">NT $ 60,000 </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="P3-3">
                        <div class="tb-container">
                            <table class="tb-money table table-bordered  dt-responsive nowrap" border="1">
                                <tr>
                                    <th>A 放款利率</th>
                                    <th colspan="3">- B 參考價格</th>
                                    <th rowspan="2">= C 合理收益</th>
                                    <th colspan="2">+ D 整體貢獻度說明</th>
                                    <th colspan="4">= E 合理利潤</th>
                                </tr>
                                <tr>
                                    <th>預定乘作利率(首年)</th>
                                    <th>資金成本</th>
                                    <th>營運成本</th>
                                    <th>預期風險損失成本</th>
                                    <th>手續費率</th>
                                    <th>其他貢獻度</th>
                                    <th>流動貼水</th>
                                    <th>資本成本</th>
                                    <th>其他</th>
                                    <th>總利潤</th>
                                </tr>
                                <tr>
                                    <td>4.15</td>
                                    <td>0.542</td>
                                    <td>0.271</td>
                                    <td>0.28</td>
                                    <td>3.057</td>
                                    <td>0.158</td>
                                    <td>0</td>
                                    <td>3.215</td>
                                    <td>0.318</td>
                                    <td>0.638</td>
                                    <td>2.259</td>
                                </tr>
                            </table>
                        </div>
                        <div class="tb-container">
                            <table class="tb-loan table table-bordered  dt-responsive nowrap" border="1">
                                <tr>
                                    <th></th>
                                    <th>姓名</th>
                                    <th>單位</th>
                                    <th>職稱</th>
                                    <th>CO層級</th>
                                    <th>無擔金額(百萬)</th>
                                    <th>授信合計</th>
                                    <th>本案無擔金額權限</th>
                                    <th>本案金額權限</th>
                                    <th>簽核日期</th>
                                </tr>
                                <tr>
                                    <th>實際簽核人員</th>
                                    <th>王大明</th>
                                    <th>消金業務部</th>
                                    <th>消金業務推廣</th>
                                    <th></th>
                                    <th>(非核委)</th>
                                    <th></th>
                                    <th rowspan="2"> $1,900,000</th>
                                    <th rowspan="2"> $1,900,000</th>
                                    <th rowspan="2">2019/01/09 17:24</th>
                                </tr>
                                <tr>
                                    <th>實際簽核人員</th>
                                    <th>王大明</th>
                                    <th>消金業務部</th>
                                    <th>消金業務推廣</th>
                                    <th></th>
                                    <th>(非核委)</th>
                                    <th></th>

                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="P3-4">
                        <div class="manyCards d-flex flex-wrap justify-content-center">
                            <div class="cardItem padding-2 flex-fill  ">
                                <div class="cardTitle">
                                    <p> 案件送簽性質 : </p>
                                </div>
                                <div class="cardWord">
                                    <p> 簽核 </p>
                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill ">
                                <div class="cardTitle">
                                    <p>簽核結果 : </p>
                                </div>
                                <div class="cardWord">
                                    <div class="cardWord">
                                        <p style="color:green;font-size:30px"> 同意 </p>
                                    </div>
                                    <!-- <img src="assets/media/S2A09.png" alt=""> -->

                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill  ">
                                <div class="cardTitle">
                                    <p>同意項目 : </p>
                                </div>
                                <div class="cardWord">
                                    <p> 核貸條件 </p>
                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill">
                                <div class="cardTitle">
                                    <p>是否為最高核委: </p>
                                </div>
                                <div class="cardWord">
                                    <p> 否 </p>
                                </div>
                            </div>
                            <div class="cardItem padding-2 flex-fill  ">
                                <div class="cardTitle">
                                    <p>建議額度: </p>
                                </div>
                                <div class="cardWord">
                                    <p style="font-size:25px">NT $ 60,000 </p>
                                </div>
                            </div>
                        </div>
                        <div class="flexContainer">

                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">調整核貸金額原因</p>
                                <div class="lnBox-discription">
                                    <!-- <p> 申覆、收支比超過規定</p> -->
                                </div>
                            </div>
                            <div class="loanTextbox flex-fill ">
                                <p class="lnBox-title">審核意見</p>
                                <div class="lnBox-discription">
                                    <!-- <p> 所得證明文件、身分證明文件、代償還款證明文件</p> -->
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
`;
        $content.html(newContentHtml);

    } else if (page == 'application') {
        //申請書

    } else if (page == 'credit') {
        // 徵信

    } else if (page == 'image') {
        // 掃描
    } else if (page == 'edit_loan') {
        // 修改核貸書
    }

}



function checkS2AWidth() {
    var el = document.getElementById("S2A2colume1");
    var e2 = document.getElementById("S2A2colume2");

    if ($(".left_div").width() > 1300) {

        $('#S2A2colume1').css('width', '60%');
        $('#S2A2colume2').css('width', '38%');

        $("#S2A3colume1").removeClass("Width100");
        $('#S2B6colume1').removeClass("Width100");
        $('.ln-repayment').addClass("row");
        $('.pay').addClass("col");
        console.log("add row")


    } else if ($(".left_div").width() < 1300) {
        $('#S2A2colume1').css('width', '100%');
        $('#S2A2colume2').css('width', '100%');
        $("#S2A3colume1").addClass("Width100");
        $('#S2B6colume1').addClass("Width100");
        $('.ln-repayment').removeClass("row");
        $('.pay').removeClass("col");
        console.log("add col")

    }
}



$("#save").click(function (event) {
    $('#save').attr('src', 'assets/media/S2A18.png');
    $('#save').removeClass("S2hover");

    window.onbeforeunload = null;
    SaveData();

});


$(function () {
    $("#save").click(function () {

        var h1 = 0;
        var h3 = 0;
        var h4 = 0;
        $("#S2B301").find(':input').each(function () {
            var ty = this.type;
            var val = $(this).val();
            if (ty == "text" && val == "") {
                h1 += 1;
                document.getElementById("S2B3text1").style.backgroundColor = "rgba(250,190,210,1)";
            }
        });
        $("#S2B303").find(':input').each(function () {
            var ty = this.type;
            var val = $(this).val();
            console.log("vv", val)
            if (val == "") {
                console.log("rrrrred!!!")
                h3 += 1;
                document.getElementById("S2B3text3").style.backgroundColor = "rgba(250,190,210,1)";

            }
        });
        $("#S2B304").find(':input').each(function () {
            var ty = this.type;
            var val = $(this).val();
            if (ty == "text" && val == "") {
                h4 += 1;
                document.getElementById("S2B3text4").style.backgroundColor = "rgba(250,190,210,1)";

            }
        });
        if (h1 == 1 || h3 == 1 || h4 == 1) {
            document.getElementById("S1A7content2").style.color = "red";
            document.getElementById("S1A7content2_1").style.color = "red";
            document.getElementById("S1A7content2_1").style.display = "inline-block";
        }
        if (h1 == 0 && h3 == 0 && h4 == 0) {
            document.getElementById("S1A7content2").style.color = "white";
            document.getElementById("S1A7content2_1").style.display = "none";
        }
        $("#S2B3text1").keydown(function () {
            h1 -= 1;
            document.getElementById("S2B3text1").style.backgroundColor = "white";
        })
        $("#S2B3text3").keydown(function () {
            h3 -= 1;
            document.getElementById("S2B3text3").style.backgroundColor = "white";
        })
        $("#S2B3text4").keydown(function () {
            h4 -= 1;
            document.getElementById("S2B3text4").style.backgroundColor = "white";
        })
        if (h1 == 0) {
            document.getElementById("S2B3text1").style.backgroundColor = "white";
        }
        if (h3 == 0) {
            document.getElementById("S2B3text3").style.backgroundColor = "white";
        }
        if (h4 == 0) {
            document.getElementById("S2B3text4").style.backgroundColor = "white";
        }



    })
});
$(function () {
    $('#S1A7content1').click(function () {
        document.getElementById("S1Arow7-1").style.backgroundColor = "rgb(21,64,74)";
        document.getElementById("S1Arow7-2").style.backgroundColor = "rgb(53,56,92)";
        document.getElementById("S1Arow7-3").style.backgroundColor = "rgb(53,56,92)";
    })
    $('#S1A7content2').click(function () {
        document.getElementById("S1Arow7-2").style.backgroundColor = "rgb(21,64,74)";
        document.getElementById("S1Arow7-1").style.backgroundColor = "rgb(53,56,92)";
        document.getElementById("S1Arow7-3").style.backgroundColor = "rgb(53,56,92)";
    })
    $('#S1A7content2_1').click(function () {
        document.getElementById("S1Arow7-2").style.backgroundColor = "rgb(21,64,74)";
        document.getElementById("S1Arow7-1").style.backgroundColor = "rgb(53,56,92)";
        document.getElementById("S1Arow7-3").style.backgroundColor = "rgb(53,56,92)";
    })
    $('#S1A7content3').click(function () {
        document.getElementById("S1Arow7-3").style.backgroundColor = "rgb(21,64,74)";
        document.getElementById("S1Arow7-2").style.backgroundColor = "rgb(53,56,92)";
        document.getElementById("S1Arow7-1").style.backgroundColor = "rgb(53,56,92)";
    })


});




function tag(Jdata) {


    $(function () {
        // console.log(Jdata)

        var availableTags = Jdata

        // var availableTags = [
        //     "大家好",
        //     "我們是第G組",
        //     "大大五花大五花",
        //     "大碗公在哪裡",
        //     "我是誰",
        //     "我們",
        //     "我",
        //     "謝謝大家的收看",
        //     "謝皇上",
        //     "謝拉",
        //     "借戶工無內容負責機車零件部分",
        //     "附近三年所得清單",
        //     "年收入皆達70萬",
        //     "工作穩定",
        //     "還款能力足",
        //     "平均月薪",
        //     "Scala",
        //     "ActionScript",
        //     "AppleScript",
        //     "Asp",
        //     "BASIC",
        //     "C",
        //     "C++",
        //     "Clojure",
        //     "COBOL",
        //     "ColdFusion",
        //     "Erlang",
        //     "Fortran",
        //     "Groovy",
        //     "Haskell",
        //     "Java",
        //     "JavaScript",
        //     "Lisp",
        //     "Perl",
        //     "PHP",
        //     "Python",
        //     "Ruby",
        //     "Scala",
        //     "Scheme"
        // ];

        function split(val) {
            return val.split(/,\s*/);
        }

        function extractLast(term) {
            return split(term).pop();
        }

        $("#S2tags")
            // don't navigate away from the field on tab when selecting an item
            .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }
            })
            .autocomplete({
                minLength: 0,
                source: function (request, response) {
                    // delegate back to autocomplete, but extract the last term
                    response($.ui.autocomplete.filter(
                        availableTags, extractLast(request.term)));
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    var terms = split(this.value);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push(ui.item.value);
                    // add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(", ");
                    return false;
                }
            });
    });
}
var S2Anotice = 1;
var S2Dnotice = 1;
var S2Bnotice = 1;
var S2Aanalysis = 1;
var S2A203 = 1;
var S2A202 = 1;
var S2A208 = 1;
var S2test = 1;

function notice() {
    $("#analysisItem_1").click(function () {
        if ($("#analysisItem_1").prop("checked")) {
            $("#analysis1").show();
        } else {
            $("#analysis1").hide();
        }
    });
    $("#analysisItem_2").click(function () {
        if ($("#analysisItem_2").prop("checked")) {
            $("#analysis2").show();
        } else {
            $("#analysis2").hide();
        }
    });
    $("#analysisItem_3").click(function () {
        if ($("#analysisItem_3").prop("checked")) {
            $("#analysis3").show();
        } else {
            $("#analysis3").hide();
        }
    });
    $("#analysisItem_4").click(function () {
        if ($("#analysisItem_4").prop("checked")) {
            $("#analysis4").show();
        } else {
            $("#analysis4").hide();
        }
    });
    $("#S2test").click(function () {
        if (window.S2test == 1) {
            $("#S2note").show();
            window.S2test = 0;
        } else if (window.S2test == 0) {
            $("#S2note").hide();
            window.S2test = 1;
        }

    });
    $("#S2Anotice").click(function () {
        if (window.S2Anotice == 1) {
            $("#S2AnoticeText").animate({
                height: "123px"
            });
            window.S2Anotice = 0;
        } else if (window.S2Anotice == 0) {
            $("#S2AnoticeText").animate({
                height: "0px"
            });
            window.S2Anotice = 1;
        }

    });
    $("#S2Anotice").mouseenter(function () {
        if (window.S2Anotice == 1) {
            $("#S2AnoticeText").animate({
                height: "123px"
            });
        }
    });
    $("#S2Anotice").mouseleave(function () {
        if (window.S2Anotice == 1) {
            $("#S2AnoticeText").animate({
                height: "0px"
            });
        }
    });

    $("#S2Dnotice").click(function () {
        if (window.S2Dnotice == 1) {
            $("#S2DnoticeText").animate({
                height: "50px"
            });
            window.S2Dnotice = 0;
        } else if (window.S2Dnotice == 0) {
            $("#S2DnoticeText").animate({
                height: "0px"
            });
            window.S2Dnotice = 1;
        }

    });
    $("#S2Dnotice").mouseenter(function () {
        if (window.S2Dnotice == 1) {
            $("#S2DnoticeText").animate({
                height: "50px"
            });
        }
    });
    $("#S2Dnotice").mouseleave(function () {
        if (window.S2Dnotice == 1) {
            $("#S2DnoticeText").animate({
                height: "0px"
            });
        }
    });


    $("#S2Bnotice").click(function () {
        if (window.S2Bnotice == 1) {
            $("#S2BnoticeText").animate({
                height: "123px"
            });
            window.S2Bnotice = 0;
        } else if (window.S2Bnotice == 0) {
            $("#S2BnoticeText").animate({
                height: "0px"
            });
            window.S2Bnotice = 1;
        }

    });
    $("#S2Bnotice").mouseenter(function () {
        if (window.S2Bnotice == 1) {
            $("#S2BnoticeText").animate({
                height: "123px"
            });
        }
    });
    $("#S2Bnotice").mouseleave(function () {
        if (window.S2Bnotice == 1) {
            $("#S2BnoticeText").animate({
                height: "0px"
            });
        }
    });
}


function save() {
    $('input').change(function () {
        $('#save').attr('src', 'assets/media/S2A19.png');
        $('#save').addClass("S2hover");
        window.onbeforeunload = confirmExit;

        function confirmExit() {
            return "Are you sure you want to exit this page?";
        }

    });
}


function creatProduct(evt, page) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("S2tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(page).style.display = "block";
    evt.currentTarget.className += " active";
}



/*section-3*/
var S3deg = 0;
$("#S3r1i8").click(function () {
    $('.left_div').toggleClass("h-87");
    $('.right_div').toggleClass("h-87");
    $("#S3row2").slideToggle("slow");

    S3deg += 180;
    $(this).css('transform', 'rotate(' + S3deg + 'deg)');

});

$(function () {
    $('#S3text').mouseover(function () {
        $("#top-picture").css('display', 'block');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text1').mouseover(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'block');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text2').mouseover(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'block');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text3').mouseover(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'block');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text4').mouseover(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'block');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text5').mouseover(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'block');
    })
    $('#S3text').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text1').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text2').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text3').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text4').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
    $('#S3text5').mouseleave(function () {
        $("#top-picture").css('display', 'none');
        $("#top-picture1").css('display', 'none');
        $("#top-picture2").css('display', 'none');
        $("#top-picture3").css('display', 'none');
        $("#top-picture4").css('display', 'none');
        $("#top-picture5").css('display', 'none');
    })
})

var d = 0;

$("#toolboximg").click(function () {
    d += 1;
    if (d % 2 == 1)
        /*$("#tooldiv").css('width','13%');*/
        $("#tooldiv").show("slide", {
            direction: "left"
        }, 500);
    if (d % 2 == 0)
        /*$("#tooldiv").css('width','0%');*/
        $("#tooldiv").hide("slide", {
            direction: "left"
        }, 500);
})


/*section-4*/

// 回主畫面
$("body").delegate(".S3r1item4", "click", function (e) {
    // e.stopPropagation();
    // const recordId = $(this).attr('data-record-id');
    // $(window).attr('location', 'index.html?user=user' + recordId)
    $(window).attr('location', "main.html")
});

$("body").delegate(".S3r1item5", "click", function (e) {
    // e.stopPropagation();
    // const recordId = $(this).attr('data-record-id');
    // $(window).attr('location', 'index.html?user=user' + recordId)
    $(window).attr('location', "https://winniepopu.github.io/UIDD-About_us/")
});


/*S2*/

$(".S2radio1").click(function () {
    $('.S2radio1').attr('src', 'assets/media/S2RadioYes.png');
})
var analysis = 1;
$(".analysis-bt").click(function () {
    if (window.analysis == 1) {
        $(".analysis").animate({
            height: "500px"
        });
        window.analysis = 0;
    } else if (window.analysis == 0) {
        $(".analysis").animate({
            height: "0px"
        });
        window.analysis = 1;
    }
});
var set = 1;
$("#S2promptSet").click(function () {
    if (window.set == 1) {
        $("#S2promptSetWindow").animate({
            height: "300px"
        });
        window.set = 0;
    } else if (window.set == 0) {
        $("#S2promptSetWindow").animate({
            height: "0px"
        });
        window.set = 1;
    }
});


$("#S2promptAdd").click(function () {
    var promptInput = $('#S2promptInput').val();
    addTag(promptInput);

});



$('#S2promptDatabase').on('click', '.S2promptDel', function () {
    var remPromptId = this.id;
    var split_id = remPromptId.split("_");
    var deleteindex = split_id[1];
    var txtID = "#txt_" + deleteindex;
    let tag = $(txtID).text();
    console.log(tag)
    delTag(tag)


});



var countMax = 120,
    countThis = $('.inputCount');

countThis.find('.count').text(countMax);

countThis.find('textarea').on('keydown keyup keypress change', function () {
    var thisValueLength = $(this).val().length,
        countDown = countMax - thisValueLength;
    countThis.find('.count').text(countDown);

    if (countDown < 0) {
        countThis.find('.count').addClass('countBelow');
    } else {
        countThis.find('.count').removeClass('countBelow');
    }
});




function loadTag(tagData) {
    const dataHtml = generateTagHtml(tagData);
    $('#S2promptDatabase').html('')
    $('#S2promptDatabase').append(dataHtml);
}

/* 提示資料庫 */
var tagID = 0

function generateTagHtml(data) {
    console.log("data:", data)
    let elementsHtml = '';

    for (item of data) {
        tagID += 1;
        var divID = "div_" + tagID;
        var txtID = "txt_" + tagID;
        var remID = "rem_" + tagID;


        const element =
            // `<p class="S2promptVocabulary S2Vcenter" id="${divID}">${item}</p>`;
            `<div class="S2row S2Vcenter S2promptData" id="${divID}">
            <p class="S2promptVocabulary S2Vcenter" id="${txtID}">${item}</p>
            <div class="S2Vcenter S2Hcenter S2promtIcon">
            <img class="S2notice S2promptDel" id="${remID}" src="assets//media//close_1.png"></div></div>`

        elementsHtml += element;
    }
    return elementsHtml;
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

function addTag(tag) {
    console.log("TT111", tag)
    if (tag == '') {
        alert("The columns can't be null, please enter the value");
    } else if (check(tag)) {
        alert("不要亂打特殊字元! 又想駭我逆")
    } else {
        console.log("TT", tag)

        const inputData = {};
        inputData['tag'] = tag;
        inputData['user'] = user;
        $.ajax({
            url: 'saveTagJSON',
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
                    alert('Tag success add!');
                    // if (list_count % 2 != 0) {
                    loadData(user);
                    // }
                    // }
                }
            },

            error: function (data, sta, type) {
                alert("ERROR!!!")
            }
        })

    }
}

function delTag(tag) {
    const inputData = {};
    inputData['tag'] = tag;
    inputData['user'] = user;

    $.ajax({
        url: 'delJSON',
        type: "POST",
        data: inputData,
        datatype: "json",
        success: function (data) {
            if (data == 'done') {
                alert('Success delete!');
                loadData(user);
            }
        },
        error: function (data, sta, type) {
            alert("WOW ERROR!!!")
        }
    })


}
// <div class="S2row S2Vcenter S2promptData" id="${divID}">
//     <p class="S2promptVocabulary S2Vcenter" id="${txtID}">${item}</p>
//     <div class="S2Vcenter S2Hcenter S2promtIcon">
//     <img class="S2notice S2promptDel" id="${renID}" src="assets//media//close_1.png"></div></div>