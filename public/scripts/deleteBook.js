
    //const deleteForm = document.getElementById('delete-book');
const deleteFormElement = document.getElementById('delete-Book')
async function deleteEntery(event){
    event.preventDefault();
    const postId = deleteFormElement.dataset.postid;

    const response =await fetch(`/deleteBook/${postId}`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        }
    });
    console.log(response);
    //const bookDelete = response.json()
    if(response){
        swal.fire({
            title: 'Success',
            width: 300,
            text: 'Book deleted!',
            icon: 'success'
        });
    }
}
deleteFormElement.addEventListener('submit', deleteEntery);
//deleteForm.addEventListener('submit',deleteEntery);


