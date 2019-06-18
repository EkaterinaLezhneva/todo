$(document).ready(function () {


    let todos = [];
    let counterForId = 0;
    let mode = 'all-todo';
    let $todos = $('.list-todos');
    let $checkAllTodo = $('.complete-all-todo');
    let $inputTodo = $('.input-todo');
    let $pages = $('.pagination');
    const $counters = $('.counter-todo');
    const enterButton = 13;
    let page = 1;


    $inputTodo.focus();

    $todos.on('click', '.btn-delete-todo', deleteTodo);
    $todos.on('change', '.checkbox-todo', checkTodo);
    $todos.dblclick('.todo', editTodo);
    $checkAllTodo.on('change', checkAll);
    $inputTodo.keypress(clickEnter);
    $pages.on('click', 'span', clickByPage);
    $('.btn-add-todo').on('click', addTodo);
    $('.tabs-todo').on('click', 'button', handleTabsClick);
    $('.btn-delete-complete').on('click', deleteCompleteTodo);


    function clickByPage(event) {
        let idForPage = $(this).attr('id');
        page = parseInt(idForPage);
        render();
    }

    function getPaginatedTodos(todos) {
        const startIndex = (page - 1) * 5;
        const endIndex = page * 5;
        return todos.slice(startIndex, endIndex);
    }

    function editTodo(event) {
        let $eventTargetForEdit = $(event.target);
        $eventTargetForEdit.prop('readonly', false);
        $eventTargetForEdit.on('blur', handleBlur);
        $eventTargetForEdit.keypress(function (event) {
            let keyCode = event.keyCode ? event.keyCode :
                event.charCode ? event.charCode :
                    event.which ? event.which : void 0;
            if (keyCode === 13) {
                handleBlur.call(this, event);
            }

        });
    }

    function handleBlur(event) {
        let idTodoForEdit = $(this).parent().attr('id');
        todos.forEach((todo) => {
            if (todo.id === Number(idTodoForEdit)) {
                if (event.target.value.trim()) {
                    todo.value = event.target.value;
                }
            }
        });
        render();
    }

    function clickEnter(event) {
        const keyCode = event.keyCode ? event.keyCode :
            event.charCode ? event.charCode :
                event.which ? event.which : void 0;
        if (keyCode === enterButton) {
            addTodo();
        }
    }

    function deleteCompleteTodo() {
        todos = todos.filter((todo) => {
            return todo.status === false;
        });

        $($checkAllTodo[0]).prop('checked', false);
        handleCounterTodo();
        render();

    }

    function handleCheckAll() {
        let checkALlTodo = todos.every((todo) => {
            return todo.status
        });

        if (checkALlTodo && todos.length) {
            $($checkAllTodo[0]).prop('checked', true);
        } else {
            $($checkAllTodo[0]).prop('checked', false);
        }
    }

    function checkAll() {
        let checkALlTodo = todos.every((todo) => {
            return todo.status
        });

        todos.forEach((todo) => {
            if (checkALlTodo) {
                todo.status = false;
            } else {
                todo.status = true;
            }
        });
        console.log('### todos', todos);
        handleCounterTodo();
        render();
    }

    function handleCounterTodo() {
        let undoneTodo;
        let completeTodo;
        let countAllTodo = todos.length;

        let quantityUndoneTodos = todos.filter((todo) => {
            return todo.status === false;
        });

        undoneTodo = quantityUndoneTodos.length;
        completeTodo = countAllTodo - undoneTodo;

        $counters.empty();
        $counters.append(`
        <span>All: ${countAllTodo}</span>
        <span>Done: ${completeTodo}</span>
        <span>Undone: ${undoneTodo}</span>
        `);
    }

    function handleTabsClick() {
        let clickByTabs = $(this).attr('class');
        $('.tabs-todo button').removeClass('active-tab');
        $(this).addClass("active-tab");
        mode = clickByTabs;
        page = 1;
        render();
    }

    function checkTodo() {

        let idTodoForCheck = $(this).parent().attr('id');


        todos.forEach((todo, index) => {
            if (todo.id === Number(idTodoForCheck)) {
                todo.status = !todo.status;
            }
        });

        handleCheckAll();
        handleCounterTodo();
        render();
    }

    function deleteTodo() {

        let idTodoForDelete = $(this).parent().attr('id');

        todos.forEach((todo, index) => {
            if (todo.id === Number(idTodoForDelete)) {
                todos.splice(index, 1)
            }
        });

        handleCheckAll();
        handleCounterTodo();
        render();
    }

    function addTodo() {
        const $inputNewTodo = $('.input-todo')[0];

        if ($inputNewTodo.value.trim()) {

            const todo = {
                value: _.escape($inputNewTodo.value),
                status: false,
                id: counterForId++,
            };

            todos.push(todo);

            handleCheckAll();
            handleCounterTodo();
            moveToLastPage();
            render();

        }
        $inputNewTodo.value = '';
    }

    function moveToLastPage(){

        let filteredTodos = todos.filter(filterByMode);
        let quantityPages = Math.ceil(filteredTodos.length / 5);
        page = quantityPages;
    }

    function render() {
        let stringForAppend = '';

        let filteredTodos;

        filteredTodos = todos.filter(filterByMode);
        calculateAndRenderPagination(filteredTodos);

        let paginatedFilteredTodos = getPaginatedTodos(filteredTodos);

        paginatedFilteredTodos.forEach(function (todo, index) {
            stringForAppend += renderOneTodo(todo)
        });

        $todos.empty();
        $todos.append(stringForAppend);
    }

    function renderOneTodo(todo) {
        return `<li class="todo" id="${todo.id}">
                  <input class="value-todo ${todo.status ? 'checked' : ''} " readonly="true" value="${todo.value}"/>
                  <input ${todo.status ? 'checked' : ''} class="checkbox-todo" type="checkbox">
                  <button class="btn-delete-todo">X</button>
                </li>`;

    }

    function filterByMode(todo) {

        if (mode === 'active-todo') {
            return todo.status === false;
        } else if (mode === 'complete-todo') {
            return todo.status === true;
        } else if (mode === 'all-todo') {
            return true
        }
    }

    function calculateAndRenderPagination(filteredTodos) {

        let quantityPages = Math.ceil(filteredTodos.length / 5);

        if (page > quantityPages) page = quantityPages;

        $pages.empty();
        let stringForAppendPage = '';

        for (let i = 1; i <= quantityPages; i++) {
            stringForAppendPage += `<span class="page ${page === i ? 'active-page' : ''}" id="${i}page"> ${i}</span>`
        }
        $pages.append(stringForAppendPage);
    }
});
