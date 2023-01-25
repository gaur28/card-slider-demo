//const swal = require('sweetalert')



const editFormElement = document.getElementById('main-form')
const titleElement = document.getElementById('title');
const summaryElement = document.getElementById('summary');
const authorElement = document.getElementById('name');
const emailElement = document.getElementById('email');
async function submitForm(event ){
    event.preventDefault();
    const postId = editFormElement.dataset.postid;
    const enteredTitle = titleElement.value;
    const enteredSummary = summaryElement.value;
    const enteredAuthor = authorElement.value;
    const enteredEmail = emailElement.value;
    
    const enteries = {title:enteredTitle,name:enteredAuthor,summary:enteredSummary,email:enteredEmail};

    const response = await fetch(`/editBook/${postId}`,{
        method: 'POST',
        body: JSON.stringify(enteries),
        headers:{
            'Content-Type': 'application/json'
        }
    });

    if(response){
        swal.fire({
            title: 'Success',
            width: 200,
            text: 'Book updated',
            icon: 'success'
        })
    }
    console.log(enteries);
}

editFormElement.addEventListener('submit', submitForm);