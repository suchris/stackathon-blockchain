pragma solidity ^0.5.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);

    event TaskCompleted(uint256 id, bool completed);

    event EditContent(uint256 id, string content);

    event TaskDeleted();

    constructor() public {
        createTask("Stackathon Ethereum Contract Demo");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function editTask(string memory _content, uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.content = _content;
        tasks[_id] = _task;
        emit EditContent(_id, _task.content);
    }

    function deleteTask(uint256 _id) public {
        delete tasks[_id];
        emit TaskDeleted();
    }
}
