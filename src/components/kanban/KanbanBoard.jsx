import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ProjectKanbanCard from './ProjectKanbanCard';

const columns = [
  { id: 'planning', title: 'Planejamento', color: 'bg-blue-100' },
  { id: 'in_progress', title: 'Em Execução', color: 'bg-yellow-100' },
  { id: 'completed', title: 'Concluído', color: 'bg-green-100' },
];

export default function KanbanBoard({ projects, consultants, clients, timeEntries, onStatusChange }) {
  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;
    
    if (!destination) return;
    
    const projectId = draggableId;
    const newStatus = destination.droppableId;
    
    onStatusChange(projectId, newStatus);
  };

  const getProjectsByStatus = (status) => {
    return projects.filter(p => p.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => {
          const columnProjects = getProjectsByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-slate-300`}>
                <h3 className="font-semibold text-slate-900">{column.title}</h3>
                <span className="text-sm text-slate-600">{columnProjects.length} projeto(s)</span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 space-y-3 min-h-[500px] rounded-b-lg ${
                      snapshot.isDraggingOver ? 'bg-slate-100' : 'bg-white'
                    } border border-t-0 border-slate-200`}
                  >
                    {columnProjects.map((project, index) => {
                      const client = clients.find(c => c.id === project.client_id);
                      const consultant = consultants.find(c => c.id === project.consultant_id);
                      const projectTimeEntries = timeEntries.filter(t => t.project_id === project.id);
                      
                      return (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ProjectKanbanCard
                                project={project}
                                client={client}
                                consultant={consultant}
                                timeEntries={projectTimeEntries}
                                allTimeEntries={timeEntries}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}