import React, { Component } from "react";

class TodoList extends Component {
  render() {
    const { tasks } = this.props;

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
          {tasks.map((task, key) => {
            return (
              <div className="taskTemplate" className="checkbox" key={key}>
                <label>
                  <input
                    type="checkbox"
                    name={task.id}
                    defaultChecked={task.completed}
                    ref={(input) => (this.checkbox = input)}
                    onClick={(ev) =>
                      this.props.toggleCompleted(this.checkbox.name)
                    }
                  />
                  <span className="content">{task.content}</span>
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
