import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, Clock, Briefcase, Tag } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SERVICE_AREAS } from '@/components/utils/serviceAreas';

const PROJECT_TYPES = {
  diagnostic: 'Diagnóstico',
  consulting: 'Consultoria',
  instructional: 'Instrutoria',
  lecture: 'Palestra',
  public_policies: 'Políticas Públicas',
  other: 'Outro',
};

export default function ProjectKanbanCard({ project, client, consultant, timeEntries, allTimeEntries, isDragging }) {
  // Calcular horas trabalhadas no projeto
  const totalHours = timeEntries.reduce((sum, t) => sum + (t.hours || 0), 0);
  const progress = project.estimated_hours > 0 
    ? Math.min((totalHours / project.estimated_hours) * 100, 100)
    : 0;

  // Calcular disponibilidade do consultor na semana atual
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const consultantWeeklyHours = allTimeEntries
    .filter(t => {
      if (t.consultant_id !== project.consultant_id) return false;
      const entryDate = new Date(t.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    })
    .reduce((sum, t) => sum + (t.hours || 0), 0);

  // Assumir semana de 40h
  const weeklyCapacity = 40;
  const availableHours = weeklyCapacity - consultantWeeklyHours;
  const capacityPercent = (consultantWeeklyHours / weeklyCapacity) * 100;

  const getCapacityColor = () => {
    if (capacityPercent < 70) return 'text-green-600';
    if (capacityPercent < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-move ${isDragging ? 'shadow-2xl opacity-90' : ''}`}>
      <CardHeader className="pb-3">
        <Link to={createPageUrl('ProjectDetail') + `?id=${project.id}`} className="hover:underline">
          <CardTitle className="text-base text-[#1e3a5f] line-clamp-2">{project.name}</CardTitle>
        </Link>
        {client && (
          <div className="flex items-center gap-1 text-sm text-slate-600 mt-2">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{client.company_name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {consultant && (
          <div className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">{consultant.name}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${getCapacityColor()}`}>
                  {availableHours.toFixed(1)}h disponíveis
                </span>
                <span className="text-slate-500">
                  {consultantWeeklyHours.toFixed(1)}h / {weeklyCapacity}h
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    capacityPercent < 70 ? 'bg-green-500' : 
                    capacityPercent < 90 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tipo, Área e Subárea */}
        <div className="space-y-1 text-xs">
          {project.project_type && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium text-slate-700">{PROJECT_TYPES[project.project_type] || project.project_type}</span>
            </div>
          )}
          {project.area && (
            <div className="flex items-start gap-1.5 text-slate-600">
              <Tag className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                {SERVICE_AREAS[project.area]?.label || project.area}
                {project.subarea && <> · <span className="text-slate-500">{project.subarea}</span></>}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>
              {project.start_date ? format(new Date(project.start_date + 'T12:00:00'), 'dd/MM/yy', { locale: ptBR }) : '-'}
              {project.end_date && (
                <> → <strong className="text-slate-800">{format(new Date(project.end_date + 'T12:00:00'), 'dd/MM/yy', { locale: ptBR })}</strong></>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <Clock className="w-3 h-3" />
            <span>{totalHours.toFixed(1)}h / {project.estimated_hours || 0}h</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progresso</span>
            <span className="font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-[#1e3a5f] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-semibold text-slate-900">
            R$ {(project.contracted_value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {project.pricing_mode && (
            <Badge variant="outline" className="text-xs">
              {project.pricing_mode === 'fixed' ? 'Valor Fixo' : 'Por Hora'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}