'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Clock, Users } from 'lucide-react';
import type { MatchHistoryRecord } from '@/types/profile';

export interface HistoryPanelProps {
  records: MatchHistoryRecord[];
  onSelectRecord: (record: MatchHistoryRecord) => void;
}

export function HistoryPanel({ records, onSelectRecord }: HistoryPanelProps) {
  return (
    <motion.section
      className="rounded-[24px] border border-[#99d8ff]/80 bg-white/92 p-7 shadow-[0_26px_54px_rgba(0,55,150,0.24),0_0_30px_rgba(74,181,255,0.28),inset_0_2px_0_rgba(255,255,255,0.9)]"
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
    >
      <h2 className="w-max rounded-b-[10px] bg-gradient-to-r from-[#2f9bff] to-[#1265e9] px-9 py-3 text-[27px] font-black text-white shadow-[0_8px_18px_rgba(21,98,218,0.34)]">
        历史记录
      </h2>

      <div className="mt-6 grid max-h-[506px] gap-4 overflow-y-auto pr-2 [scrollbar-color:#5db8ff_rgba(210,232,255,0.8)] [scrollbar-width:thin]">
        {records.map(record => {
          const win = record.result === '胜利';

          return (
            <motion.button
              key={record.id}
              type="button"
              whileHover={{ y: -4, scale: 1.012 }}
              onClick={() => onSelectRecord(record)}
              className={`grid min-h-[88px] grid-cols-[180px_150px_170px_1fr_150px] items-center gap-4 rounded-[20px] border px-7 text-left transition-all duration-300 ${
                win
                  ? 'border-[#9dd6ff] bg-gradient-to-r from-[#f8fcff] via-[#edf7ff] to-[#fff4c8] shadow-[0_12px_24px_rgba(30,110,210,0.16)] hover:shadow-[0_16px_32px_rgba(30,130,240,0.25),0_0_22px_rgba(255,210,70,0.35)]'
                  : 'border-[#e1c8ce] bg-gradient-to-r from-[#f7f9fc] via-[#eef2f7] to-[#ffe8e7] shadow-[0_12px_24px_rgba(72,82,105,0.12)] hover:shadow-[0_16px_32px_rgba(140,60,60,0.18)]'
              }`}
            >
              <div>
                <strong className="text-[25px] font-black text-[#092d85]">{record.mode}</strong>
                <p className="mt-1 flex items-center gap-2 text-[14px] font-black text-[#426aa2]">
                  <Users size={17} />
                  {record.players} 人对局
                </p>
              </div>

              <span className={`w-max rounded-full px-5 py-2 text-[18px] font-black ${
                win ? 'bg-gradient-to-r from-[#ffe87c] to-[#ffb329] text-[#7a4300]' : 'bg-gradient-to-r from-[#d9dfe8] to-[#b2bdca] text-[#4a5568]'
              }`}>
                {record.result}
              </span>

              <div>
                <p className="m-0 text-[14px] font-black text-[#5a7aaa]">本局得分</p>
                <strong className={`text-[31px] font-black ${win ? 'text-[#0b4dce]' : 'text-[#b34242]'}`}>
                  {record.score}
                </strong>
              </div>

              <p className="flex items-center gap-2 text-[17px] font-black text-[#315b9a]">
                <Clock size={18} />
                {record.time}
              </p>

              <span className="flex items-center justify-end gap-2 text-[18px] font-black text-[#1267dd]">
                查看详情
                <ChevronRight size={24} strokeWidth={3} />
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
