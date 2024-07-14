// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const titleInput = document.getElementById("taskTitle");
const dateInput = document.getElementById("dateDue");
const contentInput = document.getElementById("taskDetails");
const toDoContainer = document.getElementById("todo-cards");
const inProgressContainer = document.getElementById("in-progress-cards");
const doneContainer = document.getElementById("done-cards");
let existingTasks = JSON.parse( localStorage.getItem('existingTasks')) || [];
const addBtn = document.querySelector("#tskBtn");
const toDoSwim = document.getElementById("to-do");
const inProgressSwim = document.getElementById("in-progress");
const doneSwim = document.getElementById("done");



$(function() {
    $('#tskBtn').on('click', function(e) {
        e.preventDefault();
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
        status: 'notYetStarted'
    }
    console.log(taskObj);
    existingTasks.push(taskObj);
    localStorage.setItem("existingTasks", JSON.stringify(existingTasks));
    renderTaskList()
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
    cardBlock.setAttribute = ('id', taskObj.randId);
    h2Tag.textContent = titleInput.value;
    h2Tag.classList.add =('card-header');
    dueDate.textContent = dateInput.value;
    dueDate.classList.add = ('card-date')
    contentTag.textContent = contentInput.value;
    contentTag.classList.add = ('card-content');
    deleteBtn.classList.add = ('btn btn-danger btn-small delete-item-btn');
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

//card project-card draggable my-3 ui-draggable ui-draggable-handle


/* Todo: create a function to render the task list 
and make cards draggable*/
function renderTaskList() {
    toDoContainer.innerHTML = ""
    inProgressContainer.innerHTML = ""
    doneContainer.innerHTML = ""
    existingTasks.forEach( function(taskObj){
        createTaskCard(taskObj)
    })

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
          // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
      });
    }

// Todo: create a function to handle adding a new task
function handleAddTask(event){
            if( existingTasks ){
                tasksObj = JSON.parse(existingTasks);
                createTaskCard();
            } 
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const btnClicked = $(event.target);
    btnClicked.parent('div').remove();
}
// cardBlock.on('click', '.delete-item-btn', handleDeleteTask);
// Todo: create a function to handle dropping a task into a new status lane (draggable)
function handleDrop(event, ui) {
    const currentCardState = localStorage.getItem('tasks');
    const taskId = ui.draggable[0].dataset.randId;
    const newStatus = event.target.id;

    for (let )

        localStorage.setItem('projects', JSON.stringify(projects));
        printProjectData();
}

/* Todo: when the page loads, render the task list, 
add event listeners, make lanes droppable, and make 
the due date field a date picker*/
$(document).ready(function () {
    // ? Print project data to the screen on page load if there is any
    printProjectData();
  
    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    // ? Make lanes droppable
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
  });

/* dayjs to create the logic to change the class 
for the date part 
If the task is due more than 7 days away, the whole card should be tan/white (class = future)
if the task is due within 7 days, make the whole card yellow (income)
if the task is past due, make the whole card red (past)*/



  