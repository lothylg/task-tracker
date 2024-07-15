const titleInput = $('#taskTitle');
const dateInput = $('#dateDue');
const contentInput = $('#taskDetails');
const addBtn = $('#tskBtn');
const toDoContainer = $('#to-do');
const inProgressContainer = $('#in-progress');
const doneContainer = $('#done');
const taskFormEl = $('#taskForm');
let existingTasks = JSON.parse(localStorage.getItem('existingTasks')) || [];






// ? Reads projects from local storage and returns array of project objects.
// ? If there are no projects in localStorage, it initializes an empty array ([]) and returns it.
function readTasksFromStorage() {
    let existingTasks = JSON.parse(localStorage.getItem('existingTasks')) || [];
    return existingTasks;
}


// ? Accepts an array of projects, stringifys them, and saves them in localStorage.
function saveTasksToStorage(projects) {
  localStorage.setItem('existingTasks', JSON.stringify(existingTasks));
}

// ? Creates a project card from the information passed in `project` parameter and returns it.
//this is written in jQuery - you can mix and match using document.createElement or $('<p>) - you just can't use jQuery if it's not loaded in the script
function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id); // made purely so we can identify where it's been dragged to - will update based on where. 
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name); 
  const cardDescription = $('<p>').addClass('card-text').text(task.details);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger bg-info delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);
/*
// could also be: 
const projectCard = $(`
  <div class = "card project-card draggable my-3 data-project-id=$(project.id)"> `) // use the back tick so you can add a crap ton of information
  */
  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('here bg-warning');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('past bg-danger');
    } else if (now.isBefore(taskDueDate)) {
        taskCard.addClass('before');
    }

  }

  // ? Gather all the elements created above and append them to the correct elements.
  taskCard.append(cardHeader, cardDescription, cardDueDate, cardDeleteBtn);

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

function printTaskData() {
  const tasks = readTasksFromStorage();

  // ? Empty existing project cards out of the lanes
  const todoList = $('#to-do-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // ? Loop through projects and create project cards for each status
  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  // ? Use JQuery UI to make task cards draggable
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

// ? Removes a project from local storage and prints the project data back to the page
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const tasks = readTasksFromStorage();

  // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // ? We will use our helper function to save the tasks to localStorage
  saveTasksToStorage(tasks);

  // ? Here we use our other function to print task back to the screen
  printTaskData();
}

// ? Adds a task to local storage and prints the task data
function handleTaskFormSubmit(event) {
  event.preventDefault();

  // ? Read user input from the form
  const title = titleInput.val().trim();
  const content = contentInput.val(); 
  const taskDueDateDate = dateInput.val(); 

  const newTask = {
    // ? Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    uniqueId: crypto.randomUUID(), // random number generator
    name: title,
    dueDate: taskDueDateDate,
    details: content,
    status: 'to-do',
  };

  // ? Pull the projects from localStorage and push the new project to the array

  const tasks = readTasksFromStorage();
  existingTasks.push(newTask);

  // ? Save the updated projects array to localStorage
  saveTasksToStorage(tasks);

  // ? Print project data back to the screen
  printTaskData();

  // ? Clear the form inputs
  titleInput.val('');
  dateInput.val('');
  contentInput.val('');
}

// ? This function is called when a card is dropped into a lane. It updates the status of the project and saves it to localStorage. You can see this function is called in the `droppable` method below.
function handleDrop(event, ui) {
  // ? Read projects from localStorage
  const tasks = readTasksFromStorage(); // line 20

  // ? Get the task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem('existingTasks', JSON.stringify(existingTasks));
  printTaskData();
}

// ? Add event listener to the form element, listen for a submit event, and call the `handleTaskFormSubmit` function.
taskFormEl.on('submit', handleTaskFormSubmit);

// ? Because the cards are dynamically added to the screen, we have to use jQuery event delegation to listen for clicks on the added cards delete button.
// ? We listen for a click on the parent element, and THEN check if the target of the click is the delete button. If it is, we call the `handleDeleteProject` function
// projectDisplayEl.on('click', '.btn-delete-project', handleDeleteTask);


// ? When the document is ready, print the project data to the screen and make the lanes droppable. Also, initialize the date picker.
$(document).ready(function () {
  // ? Print project data to the screen on page load if there is any
  printTaskData();

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


