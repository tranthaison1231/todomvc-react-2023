function insertHTML(el, html) {
  el.insertAdjacentHTML('afterbegin', html);
}

function delegate(el, selector, event, handler) {
  el.addEventListener(event, (e) => {
    if (e.target.matches(selector)) handler(e, el);
  });
}

function createTodoItemEl({ value, id, completed }) {
  const li = document.createElement('li');
  li.dataset.id = id;
  li.className = 'py-[16px] px-[20px] border-solid border-b-2 border-gray-300 flex items-center justify-between';
  insertHTML(
    li,
    ` 
      <div class="flex items-center">
        <i data-todo="toggle" class='bx ${completed ? 'bx-check-square' : 'bx-square'} text-[30px] cursor-pointer'></i>
        <span data-todo="value" class="pl-[10px] ${completed ? 'line-through' : ''}"></span>
      </div>
      <i data-todo="remove" class='bx bx-trash text-[30px] cursor-pointer'></i>
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
  const eventTarget = new EventTarget();

  function saveTodos() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }

  function renderTodos() {
    listEl.replaceChildren(...todos.map((todo) => createTodoItemEl(todo)));
  }

  function readTodosInStorage() {
    todos = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  }

  inputEl.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      const newTodo = { value: inputEl.value, id: crypto.randomUUID(), completed: false };
      todos.push(newTodo);
      const todoEl = createTodoItemEl(newTodo);
      eventTarget.dispatchEvent(new CustomEvent('save'));
    }
  });

  delegate(listEl, '[data-todo="toggle"]', 'click', (e) => {
    const el = e.target.closest('[data-id]');
    const newTodo = todos.find((todo) => todo.id === el.dataset.id);
    todos = todos.map((todo) => (todo.id === newTodo.id ? { ...todo, completed: !todo.completed } : todo));
    eventTarget.dispatchEvent(new CustomEvent('save'));
  });

  delegate(listEl, '[data-todo="remove"]', 'click', (e) => {
    const el = e.target.closest('[data-id]');
    todos = todos.filter((todo) => todo.id !== el.dataset.id);
    eventTarget.dispatchEvent(new CustomEvent('save'));
  });

  eventTarget.addEventListener('save', () => {
    saveTodos();
    renderTodos();
  });

  window.addEventListener(
    'storage',
    () => {
      readTodosInStorage();
      saveTodos();
    },
    false
  );
  readTodosInStorage();
  renderTodos();
}

App();
