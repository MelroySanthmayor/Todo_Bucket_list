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
    exports.image_handler = new Vue({
		el: 'imageslider',
		data:{
			images: ['https://i.pinimg.com/564x/c7/2d/f7/c72df7061c9c7bb54ea537a05bcd553b.jpg'],
			currentNumber: 0,
			timer: null
		},
		ready: function () {
			this.startRotation();
		},
		methods: {
			startRotation: function() {
				this.timer = setInterval(this.next, 3000);
			},
	
			stopRotation: function() {
				clearTimeout(this.timer);
				this.timer = null;
			},
	
			next: function() {
				this.currentNumber += 1
			}
		}
	});
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
			attempt_addtask: false,
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
			missingInput: function () { return this.name === ''; },
			wrongNumber: function () {
				return (
				  this.isNumeric(this.number) === false ||
				  this.number < 1 ||
				  this.number > 5
				)
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
			isNumeric: function (n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			},

			addTodo: function (event) {
				this.attempt_addtask=true;
				if (this.missingInput || this.wrongNumber)
                    event.preventDefault();
					
				var value = this.newTodo && this.newTodo.trim()
				var value2=this.prty && this.prty.trim()
				if (!value && !value2) {
				  return
				}
				this.todos.push({
				  id: this.todos.length + 1,
				  title: value,
				  priority:value2,
				  completed: false
				})
				this.newTodo()
				this.newTodo = ''
				this.prty=''
			},
			getTodoList: function() {
				axios.get('/bucket_list/get')
				  .then(function(response) {
					this.todos = response.data.todos
				  }.bind(this))
			},
			updateTodo: function(todo) {
				var index = this.todos.indexOf(todo);
				axios.patch('/bucket_list/update', this.todos[index])
				  .then(function(response) {
					this.getTodoList()
				  }.bind(this))
			},
            newTodo: function() {
				axios.post('/bucket_list/new', { title: this.newTodo,priority: this.prty })
				  .then(function(response) {
					this.getTodoList()
				  }.bind(this))
			},
			toggle_all: function() {
				axios.patch('/bucket_list/toggle_completed', this.todos[])
				  .then(function(response) {
					this.getTodoList()
				  }.bind(this))
			},	  
			removeTodo: function (todo) {
				var index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
				axios.delete('/bucket_list/delete', this.todos[index])
				  .then(function(response) {
					  this.getTodoList()
                   }.bind(this))
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
                this.updateTodo()
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.editedTodo = null;
				todo.title = this.beforeEditCache;
			},

			removeCompleted: function () {
				axios.delete('/bucket_list/cmpltd_delete', this.todos)
				.then(function(response) {
					this.todos = filters.active(this.todos);
				 }.bind(this))
		  
				
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
