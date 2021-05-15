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
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    console.log("web3", web3);
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    this.setState({ todoList });
    console.log("todoList:", todoList);
    const taskCount = await todoList.methods.taskCount().call();
    console.log("taskCount:", taskCount);
    this.setState({ taskCount });
    for (let i = 1; i <= taskCount; i++) {
      const { id, content, completed } = await todoList.methods.tasks(i).call();
      const task = { id, content, completed };
      console.log("loadBlockchainData:", task);
      this.setState({
        loading: false,
        tasks: [...this.state.tasks, task],
      });
    }
    console.log("this.state.tasks:", this.state.tasks);
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);
    this.state = { account: "", taskCount: 0, tasks: [], loading: true };
    this.createTask = this.createTask.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
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
    console.log("taskId", taskId);
    this.setState({ loading: true });

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

        this.setState({
          loading: false,
          tasks,
        });
      });
    console.log("toggleCompleted: tasks", this.state.tasks);
  }

  deleteTask(taskId) {
    console.log("Delete taskId", taskId);
    this.setState({ loading: true });

    this.state.todoList.methods
      .deleteTask(taskId)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        const tasks = [...this.state.tasks.filter((t) => t.id !== taskId)];
        console.log("delete: tasks", tasks);

        this.setState({
          loading: false,
          tasks,
        });
      });
    console.log("deleteTask: tasks", this.state.tasks);
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://ethereum.org/en/developers/local-environment/"
            target="_blank"
          >
            Hackathon | Ethereum
          </a>
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
                  deleteTask={this.deleteTask}
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
