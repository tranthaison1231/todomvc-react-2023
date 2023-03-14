const getURLHash = () => document.location.hash.replace(/^#\//, '');

function delegate(el, selector, event, handler) {
  el.addEventListener(event, (e) => {
    if (e.target.matches(selector)) handler(e, el);
  });
}

const filterNotCompletedTodos = (todos) => todos.filter((todo) => !todo.completed);

function createTodoItemEl({ value, id, completed }) {
  const li = document.createElement('li');
  li.dataset.id = id;
  li.className = 'py-[16px] group px-[20px] border-solid border-b-2 border-gray-300 flex items-center justify-between';
  li.insertAdjacentHTML(
    'afterbegin',
    ` 
      <div class="flex items-center w-full">
        <i data-todo="toggle" class='bx ${completed ? 'bx-check-square' : 'bx-square'} text-[30px] cursor-pointer'></i>
        <div contenteditable="true" data-todo="value" class="pl-[10px] w-full ${completed ? 'line-through' : ''}"></div>
      </div>
      <i data-todo="remove" class='bx bx-trash text-[30px] cursor-pointer invisible group-hover:visible'></i>
    `
  );
  li.querySelector('[data-todo="value"]').textContent = value;
  return li;
}

async function App() {
  const TODO_APP_URL = 'https://64106f42be7258e14529c12f.mockapi.io';
  let todos = [];
  const inputEl = document.getElementById('input');
  const titleEl = document.getElementById('title');
  const listEl = document.getElementById('list');
  const countEl = document.getElementById('count');
  const eventTarget = new EventTarget();

  function renderTodos() {
    const filter = getURLHash();
    let filterTodos = [...todos];
    if (filter === 'active') filterTodos = filterNotCompletedTodos(todos);
    else if (filter === 'completed') filterTodos = todos.filter((todo) => todo.completed);
    countEl.innerHTML = `${filterNotCompletedTodos(todos).length} items left`;
    listEl.replaceChildren(...filterTodos.map((todo) => createTodoItemEl(todo)));
    document.querySelectorAll(`[data-todo="filters"] a`).forEach((el) => {
      if (el.matches(`[href="#/${filter}"]`)) {
        el.classList.add('checked');
      } else {
        el.classList.remove('checked');
      }
    });
  }

  const createTodo = async ({ value, completed }) => {
    try {
      const res = await fetch(`${TODO_APP_URL}/todos`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value, completed }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${TODO_APP_URL}/todos`);
      const data = await res.json();
      todos = data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTodo = async ({ id, value, completed }) => {
    try {
      await fetch(`${TODO_APP_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value, completed }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  inputEl.addEventListener('keyup', async (event) => {
    if ((event.key === 'Enter' || event.keyCode === 13) && inputEl.value.trim() !== '') {
      const newTodo = await createTodo({ value: inputEl.value, completed: false });
      todos.push(newTodo);
      createTodoItemEl(newTodo);
      eventTarget.dispatchEvent(new CustomEvent('save'));
    }
  });

  delegate(listEl, '[data-todo="toggle"]', 'click', async (e) => {
    try {
      const el = e.target.closest('[data-id]');
      const todo = todos.find((todo) => todo.id === el.dataset.id);
      await updateTodo({ ...todo, completed: !todo.completed });
      todos = todos.map((todo) => (todo.id === el.dataset.id ? { ...todo, completed: !todo.completed } : todo));
      eventTarget.dispatchEvent(new CustomEvent('save'));
    } catch (error) {
      console.error(error);
    }
  });

  delegate(listEl, '[data-todo="remove"]', 'click', async (e) => {
    const el = e.target.closest('[data-id]');
    await fetch(`${TODO_APP_URL}/todos/${el.dataset.id}`, {
      method: 'DELETE',
    });
    todos = todos.filter((todo) => todo.id !== el.dataset.id);
    eventTarget.dispatchEvent(new CustomEvent('save'));
  });

  delegate(listEl, '[data-todo="value"]', 'keydown', async (e) => {
    const el = e.target.closest('[data-id]');
    if (event.keyCode === 13) {
      e.preventDefault();
      const content = el.querySelector('[data-todo="value"]').textContent;
      const todo = todos.find((todo) => todo.id === el.dataset.id);
      await updateTodo({ ...todo, value: content });
      todos = todos.map((todo) => (todo.id === el.dataset.id ? { ...todo, value: content } : todo));
      eventTarget.dispatchEvent(new CustomEvent('save'));
    }
  });

  eventTarget.addEventListener('save', () => {
    renderTodos();
  });

  window.addEventListener('hashchange', () => {
    renderTodos();
  });

  await fetchTodos();
  renderTodos();
}

App();
