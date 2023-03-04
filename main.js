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

function App() {
  const LOCAL_STORAGE_KEY = 'todos';
  let todos = [];
  const inputEl = document.getElementById('input');
  const titleEl = document.getElementById('title');
  const listEl = document.getElementById('list');
  const countEl = document.getElementById('count');
  const eventTarget = new EventTarget();

  function saveTodos() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }

  function renderTodos() {
    const filter = getURLHash();
    let filterTodos = [...todos];
    if (filter === 'active') filterTodos = todos.filter((todo) => !todo.completed);
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

  function readTodosInStorage() {
    todos = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  }

  inputEl.addEventListener('keyup', (event) => {
    if ((event.key === 'Enter' || event.keyCode === 13) && inputEl.value.trim() !== '') {
      const newTodo = { value: inputEl.value, id: crypto.randomUUID(), completed: false };
      todos.push(newTodo);
      const todoEl = createTodoItemEl(newTodo);
      eventTarget.dispatchEvent(new CustomEvent('save'));
    }
  });

  delegate(listEl, '[data-todo="toggle"]', 'click', (e) => {
    const el = e.target.closest('[data-id]');
    todos = todos.map((todo) => (todo.id === el.dataset.id ? { ...todo, completed: !todo.completed } : todo));
    eventTarget.dispatchEvent(new CustomEvent('save'));
  });

  delegate(listEl, '[data-todo="remove"]', 'click', (e) => {
    const el = e.target.closest('[data-id]');
    todos = todos.filter((todo) => todo.id !== el.dataset.id);
    eventTarget.dispatchEvent(new CustomEvent('save'));
  });

  delegate(listEl, '[data-todo="value"]', 'keydown', (e) => {
    const el = e.target.closest('[data-id]');
    if (event.keyCode === 13) {
      e.preventDefault();
      const content = el.querySelector('[data-todo="value"]').textContent;
      todos = todos.map((todo) => (todo.id === el.dataset.id ? { ...todo, value: content } : todo));
      eventTarget.dispatchEvent(new CustomEvent('save'));
    }
  });

  eventTarget.addEventListener('save', () => {
    saveTodos();
    renderTodos();
  });

  window.addEventListener('hashchange', () => {
    renderTodos();
  });

  readTodosInStorage();
  renderTodos();
}

App();
