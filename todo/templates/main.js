//Vue.use(VeeValidate);
    var app = new Vue({
        el: "#app",
        data: {
            textField: "",
            numberField: "",
            emailField: "",
            message:"Ho there!"
        },
        methods: {
            submitForm: function (e) {
                e.preventDefault();
                if(this.errors.all().length > 0){
                    //do something to alert the user to the errors
                    return false;
                }
                //post my data to my cool API without any validation! 
            }
        }
    }).$mount('#app')
    /*var todo = new Vue({
        el: "#todos-vue",
        delimiters: ["[[", "]]"],
        data: {
          todos: [],
          newTitle: ''
        },
        mounted: function() {
          this.updateTodoList()
        },
        methods: {
          updateTodoList: function() {
            axios.get('/sqlalchemy/get')
              .then(function(response) {
                this.todos = response.data.todos
              }.bind(this))
          },
          newTodo: function() {
            axios.post('/sqlalchemy/new', { title: this.newTitle })
              .then(function(response) {
                this.updateTodoList()
              }.bind(this))
          },
          updateTodo: function(index) {
            axios.post('/sqlalchemy/update', this.todos[index])
              .then(function(response) {
                this.updateTodoList()
              }.bind(this))
          }
        }
      } 
      const path = `http://localhost:5000/
      const path = `http://localhost:5000/api/random`
     index.html 
     <!--
<label>Priority:</label>
<input class="newpriority" autofocus autocomplete="off"
placeholder="get ur priorites straight" v-bind:title="message"

type="text" maxlength="1" min='1' max='5'v-model="prty"    >
<button @click="addTodo">
  Add Task
</button>
 methods: {
     addTodo: function () {
      var value = this.newTodo && this.newTodo.trim()
      var value2=this.prty && this.prty.trim()
      if (!value && !value2) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        priority:value2,
        completed: false
      })
      this.newTodo = ''
      this.prty=''
      
    },
-->





    */