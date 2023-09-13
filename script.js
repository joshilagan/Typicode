const todosUrl = 'https://jsonplaceholder.typicode.com/todos';
const form = document.querySelector('#todo-form')

const getTodo = () => {
    fetch(todosUrl + '?_limit=5')
        .then((res) => res.json())
        .then((data) => {
            data.forEach((item) => prepareTodo(item));
        });
};

const prepareTodo = (item) => {
    const div = document.createElement('div');
    div.classList.add('todo');
    div.appendChild(document.createTextNode(item.title));
    div.setAttribute('data-id', item.id)

    if (item.completed){
        div.classList.add('done')
    }
    document.querySelector('#todo-list').appendChild(div);
};

const deleteCard = (e) => {
    if (e.target.classList.contains('todo')) {
      // console.log('delete');
      const id = e.target.dataset.id;
  
      fetch(`${todosUrl}/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => e.target.remove());
    }
  };
  

const completes = (e) => {
  if (e.target.classList.contains('todo')){
      e.target.classList.toggle('done')
      console.log(e.target.dataset.id);
      updateAPI(e.target.dataset.id, e.target.classList.contains('done'))
  }
};

const updateAPI = (id, completed) => {
  fetch(`${todosUrl}/${id}`, {
    method: 'PUT',
    body: JSON.stringify ({ completed }),    
    headers: {
      'Content-Type': 'application/json'      
    }
  })
}

const addTodoForPost = (e) => {
  e.preventDefault();
  
    const newForm = new FormData(form)
    const newTodo = newForm.get('newTodo')
    
    const newPost = {title: `${newTodo}`, completed: false};
    fetch(`${todosUrl}`, {
      method: 'POST',
      body: JSON.stringify (newPost),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res)=> res.json())
    .then((item) => prepareTodo(item))

    const input = document.querySelector('input')
    const delays = setTimeout(removeInput, 1200)
    function removeInput() {
      input.value = '';
    }    
}

const loadUp = () => {
    document.addEventListener('DOMContentLoaded', getTodo);
    document.querySelector('#todo-list').addEventListener('click', completes)
    document.querySelector('#todo-list').addEventListener('dblclick', deleteCard);
    form.addEventListener('submit', addTodoForPost)
  };
  
  loadUp();