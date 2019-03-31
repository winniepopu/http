
$(document).ready(function() {

var list_count=0;
  $('#btn-list').click((event) => {
    event.preventDefault()
    if (list_count%2==0)
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
    

      console.log(ID);  
      addStudentID(ID,Stname);
 

  })

});


const dataURL = "students.json";

function loadData(){    
$.ajax({
    url:dataURL,
      type: "GET",
        dataType: "json",
          success: function(Jdata) {
            
       //     if (mode==1)
                generateDataHtml(Jdata);
         //   else if (mode==2)
           //     findStudentID(Jdata);

                  console.log(Jdata);}
                , error: function() { alert("ERROR!!!");
                    }
});
}

    function generateDataHtml(data) {
         var html_element=''
            for (key in data){
               const element = `<h3>${key} : ${data[key]}</h3>`;
              html_element+=element;
       }
            $("#ajax-output").html(html_element);
                              }

    function cancelData(){
          const element='' ;
            $("#ajax-output").html(element);
  
    }


    function findStudentID(ID) {
         
      $.ajax({
          url:dataURL,
            type: "GET",
              dataType: "json",
                success: function(Jdata) {
                  findName(Jdata,ID);                  
                        console.log(Jdata);}
                      , error: function() { alert("ERROR!!!");
                          }
      });
      
    }





    function findName(data,ID)
    {
      const element = `<h2>Hello, ${data[ID]}</h2>`;

            $("#ajax-specific").html(element);
    }     


    function addStudentID(ID,Stname){
      const inputData = {};
      inputData['ID']=ID;
      inputData['name']=Stname;


      console.log(inputData);
    // inputData[ID] = Stname;
     // const inputData={ID:Stname};
     // console.log(inputData);
      
      const DD =  JSON.stringify(inputData);
      console.log(DD)

      console.log('URL:',dataURL)
        $.ajax({
              url:'saveJSON',
              type: "POST",
              data: inputData,
              datatype: "json",  
              success: function(data) {
                  console.log('success');}
                      , 
              
              error: function(data,sta,type) { alert("ERROR!!!")
console.log(sta)
  console.log(type)
              console.log(data)          
              console.log(data.status)          
                        ;
 
                  console.log('error');
                      
                  }
             
                      
  
                      })
    }
    


