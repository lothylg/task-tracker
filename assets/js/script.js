// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const titleInput = document.getElementById("taskTitle");
const dateInput = document.getElementById("dateDue");
const contentInput = document.getElementById("taskDetails");
const toDoContainer = document.getElementById("todo-cards");
const inProgressContainer = document.getElementById("in-progress-cards");
const doneContainer = document.getElementById("done-cards");
let existingTasks = JSON.parse( localStorage.getItem('tasks')) || []
const addBtn = document.querySelector("#tskBtn");

//when user clicks to add a task within the modal
// addBtn.addEventListener("click", generateTaskId);

// $(function() {
//     $('#tskBtn').on('click', generateTaskId ){
//         $('#taskForm').submit();
//     }
// });

$(function() {
    $('#tskBtn').on('click', function(e) {
        e.preventDefault();
        console.log("click")
        // $('#taskForm').submit();
        parseForm();
    });
});


// Todo: create a function to generate a unique task id
function generateTaskId() {
    let randId = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 10; i++ ){
      randId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randId;
}

function parseForm(){
    const randId = generateTaskId()
    const taskObj = {
        taskTitle: titleInput.value,
        dueDate: dateInput.value,
        taskContent: contentInput.value,
        uniqueID: randId,
        status: 'to-do'
    }
    console.log(taskObj);
    existingTasks.push(taskObj);
    localStorage.setItem("existingTasks", JSON.stringify(existingTasks));
    renderTaskList()
}

// Todo: create a function to create a task card
function createTaskCard(taskObj) {
    const cardBlock = document.createElement("div")
    const h2Tag = document.createElement("h2");
    const dueDate = document.createElement("p");
    const contentTag = document.createElement("p");

    h2Tag.textContent = titleInput.value;
    dueDate.textContent = dateInput.value;
    contentTag.textContent = contentInput.value;

    cardBlock.appendChild(h2Tag);
    cardBlock.appendChild(dueDate);
    cardBlock.appendChild(contentTag);

    if( taskObj.status === 'to-do' ){
        toDoContainer.appendChild(cardBlock)
    } else if (taskObj.status === 'in-progress'){
        inProgressContainer.appendChild(cardBlock)
    } else {
        doneContainer.appendChild(cardBlock)
    }
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    toDoContainer.innerHTML = ""
    inProgressContainer.innerHTML = ""
    doneContainer.innerHTML = ""
    existingTasks.forEach( function(taskObj){
        createTaskCard(taskObj)
    })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});


// dayjs to create the logic to change the class for the date part