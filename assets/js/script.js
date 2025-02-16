// Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));
const titleInput = document.getElementById("taskTitle");
const dateInput = document.getElementById("dateDue");
const contentInput = document.getElementById("taskDetails");
const toDoContainer = document.getElementById("todo-cards");
const inProgressContainer = document.getElementById("in-progress-cards");
const doneContainer = document.getElementById("done-cards");
const addBtn = document.getElementById("tskBtn");
const toDoSwim = document.getElementById("to-do");
const inProgressSwim = document.getElementById("in-progress");
const doneSwim = document.getElementById("done");
const cardEl = $('.card');

let existingTasks = JSON.parse( localStorage.getItem('existingTasks')) || [];
start();


function start(){

    if ( existingTasks ) {
        toDoContainer.innerHTML = ""
        inProgressContainer.innerHTML = ""
        doneContainer.innerHTML = ""
        existingTasks.forEach (function(existingTasks){

            let cardBlock = document.createElement("div");
            let h2Tag = document.createElement("h2");
            let dueDate = document.createElement("p");
            let contentTag = document.createElement("p");
            let deleteBtn = document.createElement("button");
        
            cardBlock.classList.add = ('card draggable future ui-draggable-handle ui-draggable ');
            
            
            h2Tag.classList.add =('card-header');
            h2Tag.textContent = taskTitle.value;
        
            dueDate.classList.add = ('card-date')
            dueDate.textContent = dueDate;
            
            contentTag.classList.add = ('card-content');
            contentTag.textContent = taskContent;
        
            deleteBtn.classList.add = ('btn btn-danger btn-small delete-item-btn');
            deleteBtn.setAttribute = ('taskId', uniqueID);
            deleteBtn.textContent = "Remove";
        
            cardBlock.appendChild(h2Tag);
            cardBlock.appendChild(dueDate);
            cardBlock.appendChild(contentTag);
            cardBlock.appendChild(deleteBtn);
        
            if( taskObj.status === 'notYetStarted' ){
                toDoContainer.appendChild(cardBlock)
            } else if (taskObj.status === 'in-progress'){
                inProgressContainer.appendChild(cardBlock)
            } else {
                doneContainer.appendChild(cardBlock)
            }

        })
    }
}
 
addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    generateTaskId();
    parseForm();
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
    let taskId = generateTaskId();
    const existingTasksString = localStorage.getItem('existingTasks');
    if (existingTasksString) {
        const existingtasks = JSON.parse(existingTasksString)
    }
    const taskObj = {
        taskTitle: titleInput.value,
        dueDate: dateInput.value,
        taskContent: contentInput.value,
        uniqueID: taskId,
        status: 'notYetStarted'
    }
    console.log(taskObj);
    existingTasks.push(taskObj);
    localStorage.setItem("existingTasks", JSON.stringify(existingTasks));
    renderTaskList();
}

/* Todo: create a function to create a task card
the card block is the individual card that sits in the swimlanes*/
function createTaskCard(taskObj) {
    const cardBlock = document.createElement("div")
    const h2Tag = document.createElement("h2");
    const dueDate = document.createElement("p");
    const contentTag = document.createElement("p");
    const deleteBtn = document.createElement("button");

    cardBlock.classList.add = ('card draggable future ui-draggable-handle ui-draggable ');
    
    
    h2Tag.classList.add =('card-header');
    h2Tag.textContent = titleInput.value;
   
    dueDate.classList.add = ('card-date')
    dueDate.textContent = dateInput.value;
    
    contentTag.classList.add = ('card-content');
    contentTag.textContent = contentInput.value;
   
    deleteBtn.classList.add = ('btn btn-danger btn-small delete-item-btn');
    deleteBtn.setAttribute = ('taskId', taskObj.randId);
    deleteBtn.textContent = "Remove";

    cardBlock.appendChild(h2Tag);
    cardBlock.appendChild(dueDate);
    cardBlock.appendChild(contentTag);
    cardBlock.appendChild(deleteBtn);

    if( taskObj.status === 'notYetStarted' ){
        toDoContainer.appendChild(cardBlock)
    } else if (taskObj.status === 'in-progress'){
        inProgressContainer.appendChild(cardBlock)
    } else {
        doneContainer.appendChild(cardBlock)
    }
    
}





/* Todo: create a function to render the task list 
and make cards draggable*/
function renderTaskList() {
    toDoContainer.innerHTML = ""
    inProgressContainer.innerHTML = ""
    doneContainer.innerHTML = ""
    existingTasks.forEach( function(taskObj){
        createTaskCard(taskObj)
    })

    // $('.draggable').draggable({
    //     opacity: 0.7,
    //     zIndex: 100,
    //     // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    //     helper: function (e) {
    //       // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
    //       return original.clone().css({
    //         width: original.outerWidth(),
    //       });
    //     },
    //   });
}




// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event).attr('taskId');
    const btnClicked = $(event);
    JSON.parse(localStorage.getItem(existingTasks));
    existingTasks.splice(existingTasks.indexOf(taskId),1);
    btnClicked.parent('div').remove();
    localStorage.setItem("existingTasks", JSON.stringify(existingTasks));
    renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane (draggable)
function handleDrop(event, ui) {
    const existingTasks = JSON.parse(localStorage.getItem('existingTasks'));
    const taskId = ui.draggable[0].dataset.uniqueID;
    const newStatus = event.target.id;

    for (let task of existingTasks){
        if ( task.uniqueID === taskId) {
            task.status = newStatus;
        }
    }

}



/* Todo: when the page loads, render the task list, 
add event listeners, make lanes droppable, and make 
the due date field a date picker*/
// $(document).ready(function () {
//     // ? Print project data to the screen on page load if there is any
//     printProjectData();
  
//     $('#taskDueDate').datepicker({
//       changeMonth: true,
//       changeYear: true,
//     });
  
//     // ? Make lanes droppable
//     $('.lane').droppable({
//       accept: '.draggable',
//       drop: handleDrop,
//     });
//   });

/* dayjs to create the logic to change the class 
for the date part 
If the task is due more than 7 days away, the whole card should be tan/white (class = future)
if the task is due within 7 days, make the whole card yellow (income)
if the task is past due, make the whole card red (past)*/



  