import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function TimeEntryForm({ open, onClose, entry, onSave, loading, consultants, projects, tasks }) {
  const [form, setForm] = useState({
    project_id: '',
    consultant_id: '',
    task_id: '',
    date: '',
    hours: '',
    description: '',
    billable: true
  });

  useEffect(() => {
    if (entry) {
      setForm({
        project_id: entry.project_id || '',
        consultant_id: entry.consultant_id || '',
        task_id: entry.task_id || undefined,
        date: entry.date || '',
        hours: entry.hours?.toString() || '',
        description: entry.description || '',
        billable: entry.billable !== false
      });
    } else {
      setForm({
        project_id: '',
        consultant_id: '',
        task_id: undefined,
        date: '',
        hours: '',
        description: '',
        billable: true
      });
    }
  }, [entry]);

  const selectedProject = projects?.find(p => p.id === form.project_id);
  const filteredTasks = tasks?.filter(t => t.project_id === form.project_id) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      project_id: form.project_id,
      consultant_id: form.consultant_id,
      date: form.date,
      hours: parseFloat(form.hours) || 0,
      description: form.description,
      billable: form.billable
    };
    
    onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="max-w-lg" aria-describedby="time-entry-description">
        <DialogHeader>
          <DialogTitle>{entry ? 'Editar Lançamento' : 'Lançar Horas'}</DialogTitle>
          <DialogDescription id="time-entry-description">
            Registre as horas trabalhadas no projeto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Projeto *</Label>
              <Select value={form.project_id || undefined} onValueChange={(v) => setForm({...form, project_id: v, task_id: undefined})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.filter(p => p?.status !== 'completed' && p?.status !== 'cancelled').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Consultor *</Label>
              <Select value={form.consultant_id || undefined} onValueChange={(v) => setForm({...form, consultant_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                   {consultants?.filter(c => c?.status === 'active').map(c => (
                     <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data *</Label>
              <Input 
                type="date"
                value={form.date} 
                onChange={(e) => setForm({...form, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Horas *</Label>
              <Input 
                type="number"
                step="0.5"
                min="0.5"
                value={form.hours} 
                onChange={(e) => setForm({...form, hours: e.target.value})}
                required
              />
            </div>
            {form.project_id && filteredTasks.length > 0 && (
              <div className="col-span-2">
                <Label>Tarefa (opcional)</Label>
                <Select value={form.task_id || undefined} onValueChange={(v) => setForm({...form, task_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vincular a tarefa" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTasks.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div>
            <Label>Descrição do trabalho</Label>
            <Textarea 
              value={form.description} 
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={3}
              placeholder="O que foi realizado neste período"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="billable" 
              checked={form.billable}
              onCheckedChange={(v) => setForm({...form, billable: v})}
            />
            <Label htmlFor="billable" className="cursor-pointer">Hora faturável</Label>
          </div>
          {selectedProject && form.hours && selectedProject.hourly_rate && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                Valor/hora do projeto: <span className="font-semibold text-slate-900">
                  R$ {selectedProject.hourly_rate.toFixed(2)}
                </span> • Total: <span className="font-semibold text-slate-900">
                  R$ {(selectedProject.hourly_rate * parseFloat(form.hours || 0)).toFixed(2)}
                </span>
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#1e3a5f] hover:bg-[#2d4a6f]">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {entry ? 'Salvar' : 'Lançar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}