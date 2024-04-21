let cl= console.log;

const postsContainer = document.getElementById("postsContainer");
const postForm =document.getElementById("postForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


const baseUrl = `https://jsonplaceholder.typicode.com`;
const postUrl =`${baseUrl}/posts`


const onEdit = (ele)=>{
    //id
    let editId= ele.closest(".card").id;
    cl(editId);
    localStorage.setItem("editId",editId);
    //editUrl
    let editUrl = `${baseUrl}/posts/${editId}`
    //api call
    makeApiCall("GET", editUrl);

}

const onDelete =(ele)=>{
    Swal.fire({
        title: "Do you want to Remove this post ?",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No!`
      }).then((result) => {
        
        if (result.isConfirmed) {
                //id
        let deleteId = ele.closest(".card").id;
        cl(deleteId);
        localStorage.setItem("deleteId", deleteId);
        //url
        let deleteUrl = `${baseUrl}/posts/${deleteId}`;
        //API call
        makeApiCall("DELETE", deleteUrl);
     } 
      });  
}
const templating = (arr) => {
    postsContainer.innerHTML = arr.map(obj => {
        return ` 
        <div class="card mb-4" id="${obj.id}">
            <div class="card-header">
                <h3 class="m-0">
                    ${obj.title}
                </h3>
            </div>
            <div class="card-body">
                 <p class="m-0">
                    ${obj.body}
                 </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
            </div>
        </div>
        `
    }).join('')
}


const makeApiCall = (methodName, apiUrl, msgBody)=>{
    loader.classList.remove("d-none");
    let xhr = new XMLHttpRequest();
    xhr.open(methodName,apiUrl);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authrization', 'Breaer Token from Local Storage')
    if(msgBody){xhr.send(JSON.stringify(msgBody))}
    else{xhr.send()}
    
    xhr.onload = function(){
        if(xhr.status>=200 && xhr.status<300){
            
            cl(xhr.response);
            let res = JSON.parse(xhr.response);
            loader.classList.add("d-none");
          
            if(methodName === "GET"){
               if(Array.isArray(res)){
                templating(res)
               } 
               else{
                cl(res,'patch in form');
                title.value = res.title;
                body.value = res.body;
                userId.value = res.userId;
                updateBtn.classList.remove("d-none");
                submitBtn.classList.add("d-none");
                window.scrollTo(0,0);
               }           
            }
            else if(methodName === "POST"){
                
                msgBody.id = res.id;
                let card = document.createElement("div");
                card.className = "card mb-4";
                card.id = msgBody.id;
                cl(msgBody)
                card.innerHTML =`
                            <div class="card-header">
                                <h3 class="m-0">
                                    ${msgBody.title}
                                </h3>
                            </div>
                            <div class="card-body">
                                <p class="m-0">
                                    ${msgBody.body}
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                            </div>
                `
                cl(card);
                postsContainer.prepend(card);
                postForm.reset();
                Swal.fire("Post Created Successfully !!!", "", "success");
            }

            else if(methodName === "PATCH"){
                cl(msgBody);
                postForm.reset();
                updateBtn.classList.add("d-none");
                submitBtn.classList.remove("d-none");
                let card = [...document.getElementById(msgBody.id).children];
                cl(card)
                card[0].innerHTML = `<h3 class="m-0">${msgBody.title}</h3>`
                card[1].innerHTML =`<p class="m-0">${msgBody.body}</p>`
                Swal.fire("Post Updated Successfully!", "", "success");
            }
            else if(methodName === "DELETE") {
                let deleteId = localStorage.getItem("deleteId");
                document.getElementById(deleteId).remove();
                Swal.fire("Post Deleted Successfully!", "", "success");
            }

        }
    }
}

makeApiCall("GET", postUrl);

const onPostSumbit = (eve) =>{
    eve.preventDefault();
    let obj = {
        title:title.value,
        body:body.value.trim(),
        userId:userId.value
    }
    cl(obj)
    makeApiCall("POST", postUrl, obj);

}

const onPostUpdate = () =>{
    //id
    let updateId = localStorage.getItem("editId");
    cl(updateId);
    //updatedObj
    let updatedObj = {
        title : title.value,
        body : body.value.trim(),
        userId : userId.value,
        id : updateId
    }
    //updateUrl
    let updateUrl = `${baseUrl}/posts/${updateId}`
    //API call
    makeApiCall("PATCH", updateUrl, updatedObj);
   
}

postForm.addEventListener("submit", onPostSumbit);
updateBtn.addEventListener("click", onPostUpdate);