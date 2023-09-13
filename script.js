const todosUrl = 'https://jsonplaceholder.typicode.com/todos';
const form = document.querySelector('#todo-form')

//for todos cards onload
//use '?_limit=5' inside fetch parameter to limit the fetched indexes to 5, the fetch address that you will need to mimic will look like this:https://jsonplaceholder.typicode.com/todos?_limit=5
const getTodo = () => {
    fetch(todosUrl + '?_limit=5')
        .then((res) => res.json())
        .then((data) => {
          //insert invoker function(use the response as an argument) to create cards outside the getTodo() function
            data.forEach((item) => prepareTodo(item));
        });
};

//create cards using this function
const prepareTodo = (item) => {
    const div = document.createElement('div');
    div.classList.add('todo');
    //use item.title as the div's text
    div.appendChild(document.createTextNode(item.title));
    //set the div's data attribute, use item.id as the attribute value
    div.setAttribute('data-id', item.id)
    //if the completed key has a value of completed, add 'done' as a class to the div
    if (item.completed){
        div.classList.add('done')
    }
    //append div to the todo-list div
    document.querySelector('#todo-list').appendChild(div);
};

//for todos deletion
const deleteCard = (e) => {
    if (e.target.classList.contains('todo')) {  
      const id = e.target.dataset.id;  
      //use fetch with 'DELETE' method to delete the index in the server's API with your specified id
      //use ${} to write the fetch address since the delete address looks something like this: https://jsonplaceholder.typicode.com/todos/5, you will need to imitate this
      fetch(`${todosUrl}/${id}`, {
        method: 'DELETE',
      })//convert your post to JSON string with JSON.stringify
        .then((res) => res.json())
        //remove the clicked card
        .then(() => e.target.remove());
    }
  };
  
//update the todos card into completed or not completed
const completes = (e) => {
  //if the e.target has a class of 'todo', use toggle to add or remove the 'done' class to it. The 'done' will indicate if it is completed, absence of 'done' means not completed
  if (e.target.classList.contains('todo')){
      e.target.classList.toggle('done')
      console.log(e.target.dataset.id);
      //use dataset.id to get its id value, and the bolean value of e.target.classList.contains('done') as an argument to the invoker, and invoke a function to update the server API
      updateAPI(e.target.dataset.id, e.target.classList.contains('done'))
  }
};
//update the server API using 'PUT' method
//use id and completed as the arrow function's parameter
const updateAPI = (id, completed) => {
  //fetch address format should look just like in line 37
  fetch(`${todosUrl}/${id}`, {
    method: 'PUT',
    //use JSON.stringify to convert the update into JSON string
    //the parameter 'completed' automatically becomes the key and its bolean value the value
    body: JSON.stringify ({ completed }),    
    headers: {
      'Content-Type': 'application/json'      
    }
  })
}

//add todo card in HTML and in the server API
const addTodoForPost = (e) => {
  e.preventDefault();
    //since we used the submit event in the form, we can now utilize the new FormData() to capture values in the input fields
    const newForm = new FormData(form)
    //use get() method, put the input's name attribute inside parenthesis, assign to variable
    const newTodo = newForm.get('newTodo')
    
    const newPost = {title: `${newTodo}`, completed: false};
    //create the promise using fetch
    fetch(todosUrl, {
      method: 'POST',
      //convert your post to JSON string with JSON.stringify
      body: JSON.stringify (newPost),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    //handle the server's response to the promise by converting it from JSON to javascript
    .then((res)=> res.json())
    //use the response
    .then((item) => prepareTodo(item))
    //delete the input text after clicking the Add button
    .then(()=>{
      const input = document.querySelector('input')
      input.value = ''; 
    })

}

const loadUp = () => {
    document.addEventListener('DOMContentLoaded', getTodo);
    document.querySelector('#todo-list').addEventListener('click', completes)
    document.querySelector('#todo-list').addEventListener('dblclick', deleteCard);
    form.addEventListener('submit', addTodoForPost)
  };
  
  loadUp();