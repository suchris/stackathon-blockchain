import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
import TodoList from "./TodoList";

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading !== this.state.loading) {
      this.render();
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    this.setState({ todoList });
    console.log("todoList:", todoList);
    const taskCount = await todoList.methods.taskCount().call();
    this.setState({ taskCount });
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      this.setState({
        loading: false,
        tasks: [...this.state.tasks, task],
      });
    }
    console.log(this.state.tasks);
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = { account: "", taskCount: 0, tasks: [], loading: true };
    this.createTask = this.createTask.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  createTask(content) {
    this.setState({ loading: true });
    console.log("content", content);

    this.state.todoList.methods
      .createTask(content)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        const taskCount = this.state.taskCount + 1;
        const task = { id: taskCount, content, completed: false };
        this.setState({
          loading: false,
          taskCount,
          tasks: [...this.state.tasks, task],
        });
      });
    console.log("createTask: tasks", this.state.tasks);
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true });
    console.log("taskId", taskId);

    this.state.todoList.methods
      .toggleCompleted(taskId)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        const tasks = [
          ...this.state.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        ];
        console.log("toggleCompleted: tasks", tasks);
        console.log("toggleCompleted: tasks", this.state.tasks);

        this.setState({
          loading: false,
          tasks: [...this.state.tasks, tasks],
        });
      });
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <p className="navbar-brand col-sm-3 col-md-2 mr-0">
            Hackathon | DApp | Todo List
          </p>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>
                <a className="nav-link" href="/#">
                  <span id="account"></span>
                </a>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="d-flex justify-content-center">
              {loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
