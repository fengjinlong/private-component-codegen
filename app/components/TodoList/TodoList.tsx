import React, { useState } from 'react';
import { Input, Button, List, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { TodoListProps, Task } from './interface';

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onSearchTask,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus
}) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = () => {
    if (newTaskDescription) {
      const newTask: Task = {
        id: Date.now().toString(),
        description: newTaskDescription,
        status: 'todo'
      };
      onAddTask(newTask);
      setNewTaskDescription('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    onSearchTask(keyword);
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-center">任务管理面板</h1>
      <div className="flex mb-4">
        <Input
          placeholder="请输入任务进行搜索"
          value={searchTerm}
          onChange={handleSearchChange}
          suffix={<SearchOutlined />}
          className="flex-grow mr-2"
        />
        <Button type="primary" onClick={() => setShowNewTaskInput(true)}>
          新增任务
        </Button>
      </div>
      {showNewTaskInput && (
        <div className="flex mb-4">
          <Input
            placeholder="请输入新增的任务信息"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button type="primary" onClick={handleAddTask} className="mr-2">
            确认
          </Button>
          <Button onClick={() => setShowNewTaskInput(false)}>取消</Button>
        </div>
      )}
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            actions={[
              <Button className="pb-4" type="link" onClick={() => onDeleteTask(task.id)}>
                删除
              </Button>
            ]}
            className="border rounded mb-4 p-4 flex"
          >
            <Checkbox
              checked={task.status === 'done'}
              onChange={() => onUpdateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
              className="mr-2 ml-4"
            />
            {task.description}
          </List.Item>
        )}
        className="bg-white"
      />
    </div>
  );
};

export default TodoList;
