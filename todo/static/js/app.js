/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var filters = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.todoapp',
		delimiters: ["[[", "]]"],  //using deleimters to differntiate jinja {{}}
		
		// app initial state
		data: {
			todos:[],
			newTodo: '',
			prty:'',
			editedTodo: null,
			visibility: 'all'
		},

		/* watch todos change for localStorage persistence
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			}
		},   */

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filteredTodos: function () {
				return filters[this.visibility](this.todos);
			},
			remaining: function () {
				return filters.active(this.todos).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.todos.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			pluralize: function (word, count) {
				return word + (count === 1 ? '' : 's');
			},

			addTodo: function () {
				var value = this.newTodo && this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({ id: this.todos.length + 1, title: value, completed: false });
				this.newTodo()
				this.newTodo = '';
			},
			updateTodoList: function() {
				axios.get('/bucket_list/get')
				  .then(function(response) {
					this.todos = response.data.todos
				  }.bind(this))
			},
			updateTodo: function(index) {
				axios.post('/bucket_list/update', this.todos[index])
				  .then(function(response) {
					this.updateTodoList()
				  }.bind(this))
			},
            newTodo: function() {
				axios.post('/bucket_list/new', { title: this.newTodo,priority: this.prty })
				  .then(function(response) {
					this.updateTodoList()
				  }.bind(this))
			},	  
			removeTodo: function (todo) {
				var index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
			},

			editTodo: function (todo) {
				this.beforeEditCache = todo.title;
				this.editedTodo = todo;
			},

			doneEdit: function (todo) {
				if (!this.editedTodo) {
					return;
				}
				this.editedTodo = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editedTodo = null;
				todo.title = this.beforeEditCache;
			},

			removeCompleted: function () {
				this.todos = filters.active(this.todos);
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);
