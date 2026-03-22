import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function TaskForm({ open, onClose, task, onSave, loading, consultants, projectId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    estimated_hours: '',
    actual_hours: '',
    due_date: '',
    status: 'todo',
    priority: 'medium',
    is_deliverable: false
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        estimated_hours: task.estimated_hours || '',
        actual_hours: task.actual_hours || '',
        due_date: task.due_date || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        is_deliverable: task.is_deliverable || false
      });
    } else {
      setForm({
        title: '',
        description: '',
        assigned_to: '',
        estimated_hours: '',
        actual_hours: '',
        due_date: '',
        status: 'todo',
        priority: 'medium',
        is_deliverable: false
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...form,
      project_id: projectId,
      estimated_hours: parseFloat(form.estimated_hours) || 0,
      actual_hours: parseFloat(form.actual_hours) || 0
    };
    
    // Se marcou como concluída, adiciona data de conclusão
    if (form.status === 'completed' && !task?.completion_date) {
      taskData.completion_date = new Date().toISOString().split('T')[0];
    }
    
    onSave(taskData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" aria-describedby="task-form-description">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
          <DialogDescription id="task-form-description">
            {task ? 'Altere os dados da tarefa' : 'Crie uma nova tarefa para o projeto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input 
              value={form.title} 
              onChange={(e) => setForm({...form, title: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Horas Estimadas</Label>
              <Input 
                type="number"
                step="0.5"
                min="0"
                value={form.estimated_hours} 
                onChange={(e) => setForm({...form, estimated_hours: e.target.value})}
                placeholder="Ex: 8"
              />
            </div>
            <div>
              <Label>Horas Reais</Label>
              <Input 
                type="number"
                step="0.5"
                min="0"
                value={form.actual_hours} 
                onChange={(e) => setForm({...form, actual_hours: e.target.value})}
                placeholder="Ex: 10"
              />
            </div>
            <div>
              <Label>Responsável</Label>
              <Select value={form.assigned_to} onValueChange={(v) => setForm({...form, assigned_to: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {consultants?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prazo</Label>
              <Input 
                type="date"
                value={form.due_date} 
                onChange={(e) => setForm({...form, due_date: e.target.value})}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="review">Revisão</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({...form, priority: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="deliverable" 
              checked={form.is_deliverable}
              onCheckedChange={(v) => setForm({...form, is_deliverable: v})}
            />
            <Label htmlFor="deliverable" className="cursor-pointer">Esta tarefa é um entregável</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#1e3a5f] hover:bg-[#2d4a6f]">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {task ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}