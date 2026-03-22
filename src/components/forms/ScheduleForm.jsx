import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, MapPin, Clock } from "lucide-react";

export default function ScheduleForm({ open, onClose, schedule, onSave, loading, projectId, consultantId, consultants, allConsultantSchedules = [] }) {
  const [form, setForm] = useState({
    date: '',
    start_time: '',
    end_time: '',
    hours: '',
    description: '',
    status: 'scheduled',
    location: ''
  });
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    if (open && schedule) {
      setForm({
        date: schedule.date || '',
        start_time: schedule.start_time || '',
        end_time: schedule.end_time || '',
        hours: schedule.hours || '',
        description: schedule.description || '',
        status: schedule.status || 'scheduled',
        location: schedule.location || ''
      });
    } else if (open && !schedule) {
      setForm({ date: '', start_time: '', end_time: '', hours: '', description: '', status: 'scheduled', location: '' });
    }
    setConflicts([]);
  }, [open, schedule]);

  // Auto-calculate hours from time range
  useEffect(() => {
    if (form.start_time && form.end_time) {
      const [sh, sm] = form.start_time.split(':').map(Number);
      const [eh, em] = form.end_time.split(':').map(Number);
      const totalMins = (eh * 60 + em) - (sh * 60 + sm);
      if (totalMins > 0) {
        setForm(prev => ({ ...prev, hours: (totalMins / 60).toFixed(1) }));
      }
    }
  }, [form.start_time, form.end_time]);

  // Check conflicts when date changes
  useEffect(() => {
    if (form.date && consultantId) {
      const dateConflicts = allConsultantSchedules.filter(s => {
        if (s.date !== form.date) return false;
        if (schedule && s.id === schedule.id) return false; // exclude self
        if (s.status === 'cancelled') return false;
        return true;
      });
      setConflicts(dateConflicts);
    } else {
      setConflicts([]);
    }
  }, [form.date, consultantId, allConsultantSchedules, schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      project_id: projectId,
      consultant_id: consultantId,
      hours: parseFloat(form.hours) || 0
    });
  };

  const consultant = consultants?.find(c => c.id === consultantId);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{schedule ? 'Editar Sessão' : 'Nova Sessão de Agenda'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {consultant && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>Consultor:</strong> {consultant.name}
            </div>
          )}

          {conflicts.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                Atenção: {conflicts.length} sessão(ões) já agendada(s) nesta data
              </div>
              {conflicts.map((c, i) => (
                <div key={i} className="text-xs text-amber-600">
                  • {c.start_time && c.end_time ? `${c.start_time} - ${c.end_time}` : 'Horário não definido'} – {c.description || 'Sem descrição'}
                </div>
              ))}
            </div>
          )}

          <div>
            <Label>Data *</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Hora Início</Label>
              <Input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div>
              <Label>Hora Término</Label>
              <Input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Duração (horas)</Label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                placeholder="Ex: 4"
              />
            </div>
          </div>

          <div>
            <Label>Local</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Local de atendimento"
              />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Descrição / Atividade</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Descreva as atividades a serem realizadas nesta sessão..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#1e3a5f] hover:bg-[#2d4a6f]">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {schedule ? 'Salvar' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}