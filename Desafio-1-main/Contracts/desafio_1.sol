// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Desafio1 {
    struct TODO{        
        uint init;
        uint end;
        string nomeTarefa;
        string status;
    }

    mapping(string => TODO) public tarefas;
    uint public contadorTarefas = 0;

    function addTask(uint _init , uint _end , string memory _taskName , string memory _status) public returns(string memory){
        TODO memory newTask;
        newTask.nomeTarefa = _taskName;
        newTask.status = _status;
        newTask.init = _init;
        newTask.end = _end;
        tarefas[_taskName] = newTask;
        contadorTarefas++;
        return "Task Added";
    }

    function getTask(string memory _taskName ) public view returns(TODO memory){
        return tarefas[_taskName];
    }

    function changeStatus(string memory _taskName, string memory _newStatus) public returns (TODO memory){
        tarefas[_taskName].status = _newStatus;
        return tarefas[_taskName];
    }
}