// Global Variables
let task = "";
let taskArray = [];
let category = "";

// Input Elements
let inputBox = document.getElementById("input-box");
let addButton = document.getElementById("add-button");
let categorySelect = document.getElementById("category-select");
let itemsSpace = document.getElementById("task-items");
let progressBar = document.getElementById("progress-bar");
let progressText = document.getElementById("progress-text");

// Event Listener for Input Box
inputBox.addEventListener("change", (event) => {
  task = event.target.value; // Capture task input
});

// Event Listener for Category Selection
categorySelect.addEventListener("change", (event) => {
  category = event.target.value; // Capture selected category
});

// Function to Save Task
function saveTask() {
  if (task === "") {
    alert("Enter your task first");
  } else {
    taskArray.push({ task, category }); // Save task and category as an object
    localStorage.setItem("Tasks", JSON.stringify(taskArray)); // Convert array to JSON string
    createItems(); // Refresh the displayed list
    updateProgress(); // Update the progress bar
    inputBox.value = ""; // Clear the input box
    categorySelect.value = "Work"; // Reset category dropdown to default
  }
}

// Event Listener for Add Button
addButton.addEventListener("click", saveTask);

// Function to Retrieve Items from LocalStorage
function getItems() {
  taskArray = JSON.parse(localStorage.getItem("Tasks")) || [];
  createItems(); // Display the saved tasks
  updateProgress(); // Update the progress bar
}

// Function to Display Tasks
function createItems() {
  itemsSpace.innerHTML = ""; // Clear the task area
  taskArray.forEach(({ task, category }, index) => {
    let item = document.createElement("div");
    item.classList.add("item");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    let itemText = document.createElement("p");
    itemText.innerHTML = `${task} (${category})`;

    let progress = document.createElement("div");
    progress.classList.add("progress");

    let icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-xmark");

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        itemText.classList.add("complete");
      } else {
        itemText.classList.remove("complete");
      }
      updateProgress();
    });

    item.appendChild(checkbox);
    item.appendChild(itemText);
    item.appendChild(progress);
    item.appendChild(icon);
    itemsSpace.appendChild(item);

    icon.addEventListener("click", () => {
      taskArray.splice(index, 1);
      localStorage.setItem("Tasks", JSON.stringify(taskArray));
      createItems();
      updateProgress();
    });
  });
}

// Function for Daily Reset
function archiveTasks() {
  let archived = JSON.parse(localStorage.getItem("ArchivedTasks")) || [];
  archived.push(...taskArray); // Append current tasks to archived
  localStorage.setItem("ArchivedTasks", JSON.stringify(archived));
}

function dailyReset() {
  let savedDate = localStorage.getItem("LastSavedDate");
  let currentDate = new Date().toISOString().split("T")[0];

  if (savedDate !== currentDate) {
    archiveTasks(); // Archive tasks before clearing
    localStorage.setItem("Tasks", JSON.stringify([]));
    taskArray = [];
    createItems();
    updateProgress();
    localStorage.setItem("LastSavedDate", currentDate);
  }
}

// Function to Update Progress Bar
function updateProgress() {
  let totalTasks = taskArray.length;
  let checkboxes = document.querySelectorAll(".item input[type='checkbox']");
  let completedTasks = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;

  let progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  progressBar.style.width = `${progressPercent}%`;
  progressText.innerHTML = `${Math.round(progressPercent)}% Complete`;
}

// Initialize the App
dailyReset();
getItems();
