import React, { Component } from "react";

class TodoList extends Component {
  render() {
    console.log("TodoList this.props.tasks", this.props.tasks);

    return (
      <div id="content">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            this.props.createTask(this.task.value);
          }}
        >
          <input
            id="newTask"
            ref={(input) => (this.task = input)}
            type="text"
            className="form-control"
            placeholder="Add task..."
            required
          />
          <input type="submit" hidden="" />
        </form>
        <ul id="taskList" className="list-unstyled">
          {this.props.tasks.map((task, key) => {
            return (
              <div className="checkbox" key={key}>
                <label>
                  <input
                    type="checkbox"
                    defaultChecked={task.completed}
                    onClick={(ev) => this.props.toggleCompleted(task.id)}
                  />
                  <span className="content">{task.content}</span>
                  <button onClick={() => console.log("click on delete button")}>
                    Delete
                  </button>
                </label>
              </div>
            );
          })}
        </ul>
        <ul id="completedTaskList" className="list-unstyled"></ul>
      </div>
    );
  }
}

export default TodoList;
