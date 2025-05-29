import { useState } from 'react';
import '../styles/page.css'; 

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const addTask = () => {
    if (inputTitle.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: inputTitle,
        description: inputDescription,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setInputTitle('');
      setInputDescription('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        title: editTitle, 
        description: editDescription 
      } : task
    ));
    setEditId(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pendente') return !task.completed;
    if (filter === 'concluido') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container">
  <h1 className="header">Notas</h1>

  <div className="form">
    <input
      type="text"
      value={inputTitle}
      onChange={(e) => setInputTitle(e.target.value)}
      placeholder="Título da tarefa"
      className="input"
    />
    <input
      type="text"
      value={inputDescription}
      onChange={(e) => setInputDescription(e.target.value)}
      placeholder="Descrição"
      className="input"
    />
    <button 
      onClick={addTask} 
      className="addButton"
      onKeyPress={(e) => e.key === 'Enter' && addTask()}
    >
      Adicionar Tarefa
    </button>
  </div>

  <div className="filters">
    <button 
      className={`filterButton ${filter === 'all' ? 'active' : ''}`}
      onClick={() => setFilter('all')}
    >
      Todas ({tasks.length})
    </button>
    <button 
      className={`filterButton ${filter === 'pendente' ? 'active' : ''}`}
      onClick={() => setFilter('pendente')}
    >
      Pendentes ({tasks.filter(t => !t.completed).length})
    </button>
    <button 
      className={`filterButton ${filter === 'concluido' ? 'active' : ''}`}
      onClick={() => setFilter('concluido')}
    >
      Concluídas ({tasks.filter(t => t.completed).length})
    </button>
  </div>

  <div className="taskList">
    {sortedTasks.length === 0 ? (
      <p className="emptyMessage">Não existem tarefas</p>
    ) : (
      sortedTasks.map(task => (
        <div 
          key={task.id} 
          className={`taskItem ${task.completed ? 'completed' : ''}`}
        >
          <div className="taskContent">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleStatus(task.id)}
              className="checkbox"
            />

            {editId === task.id ? (
              <div className="editForm">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="editInput"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="editInput"
                />
              </div>
            ) : (
              <div className="taskText">
                <h3 className="taskTitle">{task.title}</h3>
                <p className="taskDescription">{task.description}</p>
              </div>
            )}
          </div>

          <div className="taskActions">
            {editId === task.id ? (
              <button 
                onClick={() => saveEdit(task.id)}
                className="saveButton"
              >
                Salvar
              </button>
            ) : (
              <button 
                onClick={() => startEditing(task)}
                className="editButton"
              >
                Editar
              </button>
            )}
            <button 
              onClick={() => deleteTask(task.id)}
              className="deleteButton"
            >
              Excluir
            </button>
          </div>
        </div>
      ))
    )}
  </div>

  <div className="summary">
    {tasks.length > 0 && (
      <p>
        {tasks.filter(t => !t.completed).length} tarefas pendentes
      </p>
    )}
  </div>
</div>

  );
}

export default TaskApp;