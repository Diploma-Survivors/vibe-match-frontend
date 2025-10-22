'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SubmissionsService } from '@/services/submissions-service';
import { SubmissionStatus } from '@/types/submissions';
import type { Language } from '@/types/submissions';
import { useEffect, useState } from 'react';

interface SubmissionsFilterProps {
  onFilterChange: (filters: { status: string; language: string }) => void;
}

export default function SubmissionsFilter({
  onFilterChange,
}: SubmissionsFilterProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [languageList, setLanguageList] = useState<Language[]>([]);

  // Get language list
  useEffect(() => {
    const fetchLanguageList = async () => {
      const response = await SubmissionsService.getLanguageList();
      setLanguageList(response.data.data);
    };

    fetchLanguageList();
  }, []);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({ status: value, language: languageFilter });
  };

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    onFilterChange({ status: statusFilter, language: value });
  };

  return (
    <div className="p-3 border-b bg-gray-50">
      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {(() => {
                const items = [];
                for (const [key, value] of Object.entries(SubmissionStatus)) {
                  items.push(
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  );
                }
                return items;
              })()}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={languageFilter} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs">
              <SelectValue placeholder="Ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Languages</SelectItem>
              {languageList.map((lang) => (
                <SelectItem key={lang.id} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
