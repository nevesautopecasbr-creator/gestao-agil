import React from 'react';
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  // Project status
  planning: { label: "Planejamento", class: "bg-slate-100 text-slate-700" },
  in_progress: { label: "Em Execução", class: "bg-blue-100 text-blue-700" },
  completed: { label: "Concluído", class: "bg-emerald-100 text-emerald-700" },
  
  // Task status
  todo: { label: "A Fazer", class: "bg-slate-100 text-slate-700" },
  review: { label: "Revisão", class: "bg-purple-100 text-purple-700" },
  
  // Consultant availability
  full_time: { label: "Tempo Integral", class: "bg-emerald-100 text-emerald-700" },
  part_time: { label: "Meio Período", class: "bg-amber-100 text-amber-700" },
  project_based: { label: "Por Projeto", class: "bg-blue-100 text-blue-700" },
  
  // General status
  active: { label: "Ativo", class: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inativo", class: "bg-slate-100 text-slate-700" },
  prospect: { label: "Prospecto", class: "bg-purple-100 text-purple-700" },
  
  // Expense status
  pending: { label: "Pendente", class: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprovado", class: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejeitado", class: "bg-rose-100 text-rose-700" },
  reimbursed: { label: "Reembolsado", class: "bg-blue-100 text-blue-700" },
  
  // Priority
  low: { label: "Baixa", class: "bg-slate-100 text-slate-700" },
  medium: { label: "Média", class: "bg-amber-100 text-amber-700" },
  high: { label: "Alta", class: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgente", class: "bg-rose-100 text-rose-700" }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, class: "bg-slate-100 text-slate-700" };
  
  return (
    <Badge className={`${config.class} font-medium border-0`}>
      {config.label}
    </Badge>
  );
}